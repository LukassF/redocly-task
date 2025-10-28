import { useEffect, useState } from "react";
import FileUpload from "./components/FileUpload";
import type {
  MediaTypeObject,
  OpenAPI3,
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
} from "openapi-typescript";
import { HTTP_METHOD } from "./types/enums";
import {
  divideParamsIntoCategories,
  getColorForMethod,
  getResponseIndicatorColor,
} from "./utils/openapi";
import { capitalizeFirstLetter } from "./utils/general";
import type { ExtendedSchemaObject, SchemaProperty } from "./types/openapi";
import clsx from "clsx";

function App() {
  const [api, setApi] = useState<OpenAPI3 | null>(null);
  const [activeResponseType, setActiveResponseType] = useState(0);
  useEffect(() => {
    console.log(api);
  }, [api]);
  return (
    <main className="bg-gray-50 min-h-screen flex flex-col items-stretch w-screen p-[16px]">
      <FileUpload onSetApi={setApi} />
      {api ? (
        <div className="mt-8 w-full bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            {api.info?.title} ({api.openapi})
          </h2>
          <p className="text-gray-600 mb-6">{api.info?.description}</p>

          <h3 className="text-lg font-semibold mb-2">Paths:</h3>
          {Object.entries(api.paths || {}).map(([path, methods]) =>
            Object.entries(methods).map(
              ([method, details]: [string, OperationObject]) => (
                <div className="flex flex-col border-b mb-[48px]">
                  <div key={`${method}-${path}`} className="mb-4">
                    <span
                      className={`py-1 text-sm rounded ${getColorForMethod(
                        method as HTTP_METHOD
                      )}`}
                    >
                      {method.toUpperCase()}
                    </span>{" "}
                    <span className="font-mono text-sm">{path}</span>
                    <p className="text-gray-700">{details.summary}</p>
                  </div>

                  {"parameters" in details ? (
                    <div>
                      {Object.entries(
                        divideParamsIntoCategories(
                          details.parameters as ParameterObject[]
                        )
                      ).map(([type, params]) => (
                        <div>
                          <h2 className="font-bold text-xl mb-[16px]">
                            {capitalizeFirstLetter(type)}
                          </h2>
                          {params?.map((parameter, idx) => (
                            <div
                              key={idx}
                              className="mb-[16px] font-light flex flex-col gap-[2px]"
                            >
                              <h3 className="font-semibold">
                                {parameter.name}
                                <span className="!font-medium text-small ml-[8px] text-brand-grey-500">
                                  {[
                                    parameter.schema?.type,
                                    parameter.schema?.format,
                                  ]
                                    .filter(Boolean)
                                    .join(", ")}
                                </span>
                                {parameter.required ? (
                                  <span className="!font-medium text-small ml-[8px] text-red-500">
                                    Required
                                  </span>
                                ) : null}
                              </h3>
                              <p className="text-gray-600">
                                {parameter.description}
                              </p>
                              <div className="mt-[5px] flex gap-[6px] items-center">
                                <span className="text-gray-600">Example</span>
                                <span className="bg-gray-100 text-small rounded-[6px] px-[5px] py-[2px] border-solid border-[0.5px] border-brand-grey-500">
                                  {parameter.name}={parameter.schema?.example}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {"requestBody" in details ? (
                    <div>
                      <div className=" mb-[16px]">
                        <h2 className="font-bold text-xl">
                          {"Body"}
                          <span className="font-light ml-[8px] text-large">
                            {
                              Object.keys(
                                (details.requestBody as RequestBodyObject)
                                  .content
                              )[0]
                            }
                          </span>
                        </h2>
                        {(details.requestBody as RequestBodyObject).required ? (
                          <span className="!font-medium text-red-500">
                            Required
                          </span>
                        ) : null}
                      </div>

                      {Object.entries(
                        (
                          (
                            Object.values(
                              (details.requestBody as RequestBodyObject).content
                            )[0] as MediaTypeObject
                          ).schema as ExtendedSchemaObject
                        )?.properties
                      )?.map(([name, value], idx) => (
                        <div
                          key={idx}
                          className="mb-[16px] font-light flex flex-col gap-[2px]"
                        >
                          <h3 className="font-semibold">
                            {name}
                            <span className="!font-medium text-small ml-[8px] text-brand-grey-500">
                              {value.type === "array" && value.items
                                ? `${value.type} of ${value.items.type} (${value.items.format})`
                                : [value.type, value.format]
                                    .filter(Boolean)
                                    .join(", ")}
                            </span>
                          </h3>
                          {value.items ? (
                            <div className="mt-[5px] flex gap-[6px] items-center">
                              <span className="text-gray-600">Example</span>
                              <span className="bg-gray-100 text-small rounded-[6px] px-[5px] py-[2px] border-solid border-[0.5px] border-brand-grey-500">
                                {name}={value.items.example}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {details.responses ? (
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <h2 className="font-bold text-xl my-[16px] mr-[16px]">
                          Response
                        </h2>
                        {Object.keys(details.responses).map((code, idx) => (
                          <button
                            onClick={() => setActiveResponseType(idx)}
                            className="bg-gray-100 px-[10px] mx-[2px] h-[30px] text-small rounded-[5px] flex items-center justify-center gap-[4px] hover:bg-gray-50"
                          >
                            <div
                              className={clsx(
                                "w-[8px] h-[8px] rounded-full",
                                getResponseIndicatorColor(+code)
                              )}
                            ></div>
                            {code}
                          </button>
                        ))}
                      </div>

                      <p className="text-gray-600 font-light">
                        {
                          Object.values(details.responses)[activeResponseType]
                            .description
                        }
                      </p>

                      <div>
                        <div className=" my-[16px] flex items-center">
                          <h2 className="font-bold text-xl">{"Body"}</h2>
                          <span className="font-light ml-[8px] text-large">
                            {
                              Object.keys(
                                Object.values(
                                  details.responses as ResponseObject[]
                                )[activeResponseType].content ?? {}
                              )[0]
                            }
                          </span>
                        </div>
                        {Object.entries(
                          ((
                            Object.values(
                              (
                                Object.values(
                                  details.responses
                                ) as ResponseObject[]
                              )[activeResponseType].content ?? {}
                            )[0]?.schema as SchemaProperty
                          )?.properties as Record<string, SchemaProperty>) ??
                            (
                              Object.values(
                                (
                                  Object.values(
                                    details.responses
                                  ) as ResponseObject[]
                                )[activeResponseType].content ?? {}
                              )[0]?.schema as SchemaProperty
                            )?.items?.properties ??
                            {}
                        )?.map(([name, value], idx) => (
                          <div
                            key={idx}
                            className="mb-[16px] font-light flex flex-col gap-[2px]"
                          >
                            <h3 className="font-semibold">
                              {name}
                              <span className="!font-medium text-small ml-[8px] text-brand-grey-500">
                                {value.type === "array" && value.items
                                  ? `${value.type} of ${value.items.type} (${value.items.format})`
                                  : [value.type, value.format]
                                      .filter(Boolean)
                                      .join(", ")}
                              </span>
                              {(
                                Object.values(
                                  (
                                    Object.values(
                                      details.responses
                                    ) as ResponseObject[]
                                  )[activeResponseType].content ?? {}
                                )[0]?.schema as SchemaProperty
                              )?.items?.required?.includes(name) ? (
                                <span className="!font-medium text-small ml-[8px] text-red-500">
                                  Required
                                </span>
                              ) : null}
                            </h3>

                            {value.example ? (
                              <div className="mt-[5px] flex gap-[6px] items-center">
                                <span className="text-gray-600">Example</span>
                                <span className="bg-gray-100 text-small rounded-[6px] px-[5px] py-[2px] border-solid border-[0.5px] border-brand-grey-500">
                                  {name}={value.example}
                                </span>
                              </div>
                            ) : null}
                            {value.items ? (
                              <div className="mt-[5px] flex gap-[6px] items-center">
                                <span className="text-gray-600">Example</span>
                                <span className="bg-gray-100 text-small rounded-[6px] px-[5px] py-[2px] border-solid border-[0.5px] border-brand-grey-500">
                                  {name}={value.items.example}
                                </span>
                              </div>
                            ) : null}
                          </div>
                        ))}
                        {/* 
                        {Object.entries(
                          (
                            (
                              Object.values(
                                (details.requestBody as RequestBodyObject)
                                  .content
                              )[0] as MediaTypeObject
                            ).schema as ExtendedSchemaObject
                          )?.properties
                        )?.map(([name, value], idx) => (
                          <div
                            key={idx}
                            className="mb-[16px] font-light flex flex-col gap-[2px]"
                          >
                            <h3 className="font-semibold">
                              {name}
                              <span className="!font-medium text-small ml-[8px] text-brand-grey-500">
                                {value.type === "array" && value.items
                                  ? `${value.type} of ${value.items.type} (${value.items.format})`
                                  : [value.type, value.format]
                                      .filter(Boolean)
                                      .join(", ")}
                              </span>
                            </h3>
                            {value.items ? (
                              <div className="mt-[5px] flex gap-[6px] items-center">
                                <span className="text-gray-600">Example</span>
                                <span className="bg-gray-100 text-small rounded-[6px] px-[5px] py-[2px] border-solid border-[0.5px] border-brand-grey-500">
                                  {name}={value.items.example}
                                </span>
                              </div>
                            ) : null}
                          </div> */}
                        {/* ))} */}
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            )
          )}
        </div>
      ) : null}
    </main>
  );
}

export default App;
