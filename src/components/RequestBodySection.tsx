import type { MediaTypeObject, RequestBodyObject } from "openapi-typescript";

import {
  extractSchemaProperties,
  formatSchemaPropertyType,
} from "../utils/openapi";
import type { SchemaProperty } from "../types/openapi";

interface IProps {
  requestBody?: RequestBodyObject;
}

export const RequestBodySection = ({ requestBody }: IProps) => {
  if (!requestBody) {
    return null;
  }

  const contentEntries = Object.entries(requestBody.content ?? {});

  if (!contentEntries.length) {
    return null;
  }

  const [mediaType, mediaDefinition] = contentEntries[0];
  const schema = (mediaDefinition as MediaTypeObject).schema as
    | SchemaProperty
    | undefined;
  const properties = extractSchemaProperties(schema);

  return (
    <section>
      <div className="mb-[16px] flex items-baseline gap-[8px]">
        <h2 className="font-bold text-xl">Body</h2>
        {mediaType ? (
          <span className="font-light text-large">{mediaType}</span>
        ) : null}
        {requestBody.required ? (
          <span className="!font-medium text-red-500 text-small">Required</span>
        ) : null}
      </div>

      {Object.entries(properties).map(([name, property]) => (
        <div
          key={name}
          className="mb-[16px] font-light flex flex-col gap-[2px]"
        >
          <h3 className="font-semibold">
            {name}
            <span className="!font-medium text-small ml-[8px] text-brand-grey-500">
              {formatSchemaPropertyType(property)}
            </span>
          </h3>
          {property.example !== undefined ? (
            <div className="mt-[5px] flex gap-[6px] items-center">
              <span className="text-gray-600">Example</span>
              <span className="bg-gray-100 text-small rounded-[6px] px-[5px] py-[2px] border-solid border-[0.5px] border-brand-grey-500">
                {name}={String(property.example)}
              </span>
            </div>
          ) : null}
          {property.items?.example !== undefined ? (
            <div className="mt-[5px] flex gap-[6px] items-center">
              <span className="text-gray-600">Example</span>
              <span className="bg-gray-100 text-small rounded-[6px] px-[5px] py-[2px] border-solid border-[0.5px] border-brand-grey-500">
                {name}={String(property.items.example)}
              </span>
            </div>
          ) : null}
        </div>
      ))}
    </section>
  );
};

export default RequestBodySection;
