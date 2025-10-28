import type { SchemaObject } from "openapi-typescript";

export type SchemaProperty = SchemaObject & {
  items?: ExtendedSchemaObject;
};

export type ExtendedSchemaObject = SchemaObject & {
  properties: Record<string, SchemaProperty>;
};
