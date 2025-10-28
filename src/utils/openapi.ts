import type {
  ExampleObject,
  MediaTypeObject,
  OpenAPI3,
  ParameterObject,
  RequestBodyObject,
} from "openapi-typescript";
import type { SchemaProperty } from "../types/openapi";
import { HTTP_METHOD } from "../types/enums";
import { bundleFromString, createConfig } from "@redocly/openapi-core";
import axios from "axios";

export const parseYamlContent = async (text: string) => {
  const config = await createConfig({});

  const result = await bundleFromString({
    source: text,
    config,
    dereference: true,
  });

  return result.bundle.parsed as OpenAPI3;
};

export const buildExampleQueryString = (
  parameters: ParameterObject[] = []
): string => {
  const queryParams = parameters
    .map((param) => {
      const value = param.schema?.example ?? param.schema?.default ?? "";
      return `${encodeURIComponent(param.name)}=${encodeURIComponent(
        String(value)
      )}`;
    })
    .join("&");

  return queryParams ? `?${queryParams}` : "";
};

export const fillPathParams = (
  path: string,
  parameters: ParameterObject[]
): string => {
  return path.replace(/{([^}]+)}/g, (match, paramName) => {
    const param = parameters.find(
      (p) => p.name === paramName && p.in === "path"
    );

    if (!param) {
      console.log(`Missing parameter: ${paramName}`);
      return match;
    }

    const example = param.schema?.example ?? param.example;
    return encodeURIComponent(String(example));
  });
};

export const buildExampleRequestBody = (bodyObject: RequestBodyObject) => {
  const content = Object.values(bodyObject.content)[0] as MediaTypeObject;
  const example: ExampleObject | undefined = content.examples
    ? Object.values(content.examples)[0]
    : undefined;

  if (!example) {
    // if body is required, fallback to example values from schema - didn't have time to implement
    return {};
  }

  const object: Record<string, unknown> = {};
  Object.entries(example.value).forEach(([key, value]) => {
    if (!(key in object)) {
      object[key] = value;
    }
  });

  return object;
};

export const handleExampleRequest = async (
  method: HTTP_METHOD,
  baseUrl: string,
  path: string,
  parameters: ParameterObject[] | undefined,
  body: RequestBodyObject | undefined
) => {
  try {
    let url = baseUrl + path;
    let finalBody: Record<string, unknown> = {};
    if (parameters) {
      const allParams = divideParamsIntoCategories(parameters);

      if ("path" in allParams) {
        url = fillPathParams(url, allParams.path);
      }

      if ("query" in allParams) {
        url += buildExampleQueryString(allParams.query);
      }
    }
    if (body) {
      finalBody = buildExampleRequestBody(body);
    }

    const response = await axios(url, {
      method,
      headers: {
        Accept: "application/json",
        Authorization: "Basic " + btoa("<username>:<password>"),
      },
      data: finalBody,
    });

    return response;
  } catch (error) {
    console.log("Error running example request", error);
  }
};

export const getColorForMethod = (method: HTTP_METHOD): string => {
  switch (method) {
    case HTTP_METHOD.GET:
      return "text-green-500";
    case HTTP_METHOD.POST:
      return "text-blue-500";
    case HTTP_METHOD.PUT:
    case HTTP_METHOD.PATCH:
      return "text-yellow-300";
    case HTTP_METHOD.DELETE:
      return "text-red-400";

    default:
      return "text-gray-500";
  }
};

export const getResponseIndicatorColor = (code: number): string => {
  switch (code.toString()[0]) {
    case "2":
      return "bg-green-500";
    case "4":
      return "bg-red-500";

    default:
      return "bg-gray-500";
  }
};

export const divideParamsIntoCategories = (
  params: ParameterObject[]
): Record<string, ParameterObject[]> => {
  return params.reduce((acc, param) => {
    acc[param.in] = [...(acc[param.in] ?? []), param];
    return acc;
  }, {} as Record<string, ParameterObject[]>);
};

export const extractSchemaProperties = (
  schema?: SchemaProperty
): Record<string, SchemaProperty> => {
  if (!schema) {
    return {};
  }

  if ("properties" in schema && schema.properties) {
    return schema.properties as Record<string, SchemaProperty>;
  }

  if (
    schema.type === "array" &&
    schema.items &&
    "properties" in schema.items &&
    schema.items.properties
  ) {
    return schema.items.properties;
  }

  return {};
};

export const getRequiredPropertyNames = (schema?: SchemaProperty): string[] => {
  if (!schema) {
    return [];
  }

  if (Array.isArray(schema.required) && schema.required.length) {
    return schema.required;
  }

  if (
    schema.type === "array" &&
    schema.items &&
    "required" in schema.items &&
    Array.isArray(schema.items.required)
  ) {
    return schema.items.required;
  }

  return [];
};

export const formatSchemaPropertyType = (property: SchemaProperty): string => {
  if (property.type === "array" && property.items) {
    const itemType = property.items.type ?? "";
    const itemFormat = property.items.format
      ? ` (${property.items.format})`
      : "";

    return `array of ${itemType}${itemFormat}`.trim();
  }

  return [property.type, property.format].filter(Boolean).join(", ");
};
