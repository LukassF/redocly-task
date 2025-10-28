import type { ParameterObject } from "openapi-typescript";

import { divideParamsIntoCategories } from "../utils/openapi";
import { capitalizeFirstLetter } from "../utils/general";
import { useMemo } from "react";

interface IProps {
  parameters?: ParameterObject[];
}

export const ParametersSection = ({ parameters }: IProps) => {
  const categorizedParameters = useMemo(() => {
    if (!parameters?.length) {
      return null;
    }
    return divideParamsIntoCategories(parameters);
  }, [parameters]);

  return (
    <div>
      {Object.entries(categorizedParameters ?? {}).map(([type, params]) => (
        <section key={type}>
          <h2 className="font-bold text-xl mb-[16px]">
            {capitalizeFirstLetter(type)}
          </h2>
          {params.map((parameter) => {
            const typeInfo = [parameter.schema?.type, parameter.schema?.format]
              .filter(Boolean)
              .join(", ");

            return (
              <div
                key={parameter.name}
                className="mb-[16px] font-light flex flex-col gap-[2px]"
              >
                <h3 className="font-semibold">
                  {parameter.name}
                  {typeInfo ? (
                    <span className="!font-medium text-small ml-[8px] text-brand-grey-500">
                      {typeInfo}
                    </span>
                  ) : null}
                  {parameter.required ? (
                    <span className="!font-medium text-small ml-[8px] text-red-500">
                      Required
                    </span>
                  ) : null}
                </h3>
                {parameter.description ? (
                  <p className="text-gray-600">{parameter.description}</p>
                ) : null}
                {parameter.schema?.example !== undefined ? (
                  <div className="mt-[5px] flex gap-[6px] items-center">
                    <span className="text-gray-600">Example</span>
                    <span className="bg-gray-100 text-small rounded-[6px] px-[5px] py-[2px] border-solid border-[0.5px] border-brand-grey-500">
                      {parameter.name}={String(parameter.schema.example)}
                    </span>
                  </div>
                ) : null}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
};

export default ParametersSection;
