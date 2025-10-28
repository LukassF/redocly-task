import { describe, expect, it } from "vitest";

import type { SchemaProperty } from "../types/openapi";
import {
  extractSchemaProperties,
  formatSchemaPropertyType,
  getRequiredPropertyNames,
} from "./openapi";

describe("openapi utils", () => {
  it("extracts properties from object and array schemas", () => {
    const objectSchema: SchemaProperty = {
      type: "object",
      properties: {
        id: { type: "string" },
      },
    };

    const arraySchema: SchemaProperty = {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
        },
      },
    };

    expect(extractSchemaProperties(objectSchema)).toHaveProperty("id");
    expect(extractSchemaProperties(arraySchema)).toHaveProperty("name");
  });

  it("detects required fields and formats array property types", () => {
    const arraySchema: SchemaProperty = {
      type: "array",
      items: {
        type: "object",
        required: ["id"],
        properties: {
          id: { type: "string" },
          tags: {
            type: "array",
            items: {
              type: "string",
              format: "uuid",
            },
          },
        },
      },
    };

    const properties = extractSchemaProperties(arraySchema);

    expect(getRequiredPropertyNames(arraySchema)).toEqual(["id"]);
    expect(formatSchemaPropertyType(properties.tags)).toBe(
      "array of string (uuid)"
    );
  });
});
