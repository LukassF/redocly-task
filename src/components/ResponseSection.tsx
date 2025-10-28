import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import type { ResponseObject } from "openapi-typescript";

import type { SchemaProperty } from "../types/openapi";
import {
  extractSchemaProperties,
  formatSchemaPropertyType,
  getRequiredPropertyNames,
  getResponseIndicatorColor,
} from "../utils/openapi";

interface IProps {
  responses?: Record<string, ResponseObject>;
}

export const ResponseSection = ({ responses }: IProps) => {
  const responseEntries = useMemo(
    () => Object.entries(responses ?? {}),
    [responses]
  );

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (activeIndex >= responseEntries.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, responseEntries.length]);

  if (!responseEntries.length) {
    return null;
  }

  const [, activeResponse] =
    responseEntries[activeIndex] ?? responseEntries[0];
  const contentEntries = Object.entries(activeResponse.content ?? {});
  const [mediaType, mediaDefinition] = contentEntries[0] ?? [];
  const schema = mediaDefinition?.schema as SchemaProperty | undefined;
  const properties = extractSchemaProperties(schema);
  const requiredFields = new Set(getRequiredPropertyNames(schema));

  return (
    <section className="flex flex-col">
      <div className="flex items-center flex-wrap gap-[4px]">
        <h2 className="font-bold text-xl my-[16px] mr-[16px]">Response</h2>
        {responseEntries.map(([code], index) => (
          <button
            key={code}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={clsx(
              "bg-gray-100 px-[10px] h-[30px] text-small rounded-[5px] flex items-center justify-center gap-[4px] hover:bg-gray-50",
              index === activeIndex && "ring-1 ring-brand-grey-500"
            )}
          >
            <div
              className={clsx(
                "w-[8px] h-[8px] rounded-full",
                getResponseIndicatorColor(Number(code))
              )}
            />
            {code}
          </button>
        ))}
      </div>

      {activeResponse.description ? (
        <p className="text-gray-600 font-light">{activeResponse.description}</p>
      ) : null}

      {mediaDefinition ? (
        <div className="my-[16px] flex items-baseline gap-[8px]">
          <h3 className="font-bold text-xl">Body</h3>
          {mediaType ? (
            <span className="font-light text-large">{mediaType}</span>
          ) : null}
        </div>
      ) : null}

      {Object.entries(properties).map(([name, property]) => (
        <div
          key={name}
          className="mb-[16px] font-light flex flex-col gap-[2px]"
        >
          <h4 className="font-semibold">
            {name}
            <span className="!font-medium text-small ml-[8px] text-brand-grey-500">
              {formatSchemaPropertyType(property)}
            </span>
            {requiredFields.has(name) ? (
              <span className="!font-medium text-small ml-[8px] text-red-500">
                Required
              </span>
            ) : null}
          </h4>

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

export default ResponseSection;
