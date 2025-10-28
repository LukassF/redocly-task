import { useState } from "react";
import FileUpload from "./components/FileUpload";
import type {
  OpenAPI3,
  OperationObject,
  ParameterObject,
  RequestBodyObject,
  ResponseObject,
} from "openapi-typescript";
import { HTTP_METHOD } from "./types/enums";
import {
  getColorForMethod,
  handleExampleRequest,
  parseYamlContent,
} from "./utils/openapi";
import ParametersSection from "./components/ParametersSection";
import RequestBodySection from "./components/RequestBodySection";
import ResponseSection from "./components/ResponseSection";
import EditorContainer from "./components/Editor";

function App() {
  const [api, setApi] = useState<OpenAPI3 | null>(null);
  const [yamlRaw, setYamlRaw] = useState<string | null>(null);
  const [exampleResponse, setExampleResponse] = useState<string | null>(null);

  return (
    <main className="bg-gray-50 min-h-screen flex flex-col items-stretch w-screen p-[16px]">
      <FileUpload onSetApi={setApi} onSetYamlRaw={setYamlRaw} />
      {yamlRaw ? (
        <EditorContainer
          definition={yamlRaw}
          onConfirm={async (text: string) => {
            const apiContent = await parseYamlContent(text);
            setApi(apiContent);
          }}
        />
      ) : null}
      <div className="flex gap-[16px]">
        {api ? (
          <div className="flex-1 mt-8 w-full bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">
              {api.info?.title} ({api.openapi})
            </h2>
            <p className="text-gray-600 mb-6">{api.info?.description}</p>

            <h3 className="text-lg font-semibold mb-2">Paths:</h3>
            {Object.entries(api.paths || {}).map(([path, methods]) =>
              Object.entries(methods).map(([method, operation]) => {
                const operationDetails = operation as OperationObject;
                const parameters =
                  "parameters" in operationDetails
                    ? (operationDetails.parameters as ParameterObject[])
                    : undefined;

                const requestBody =
                  "requestBody" in operationDetails
                    ? (operationDetails.requestBody as RequestBodyObject)
                    : undefined;

                const responses = operationDetails.responses as Record<
                  string,
                  ResponseObject
                >;

                return (
                  <div
                    key={`${method}-${path}`}
                    className="flex flex-col border-b mb-[48px]"
                  >
                    <div className="mb-4">
                      <span
                        className={`py-1 text-lg rounded ${getColorForMethod(
                          method as HTTP_METHOD
                        )}`}
                      >
                        {method.toUpperCase()}
                      </span>{" "}
                      <span className="font-mono text-sm">{path}</span>
                      {operationDetails.summary ? (
                        <p className="text-gray-700">
                          {operationDetails.summary}
                        </p>
                      ) : null}
                    </div>

                    <button
                      className="h-[30px] w-[120px] bg-blue-400 text-white text-small rounded-[10px] mb-[10px] hover:bg-blue-500"
                      onClick={async () => {
                        const response = await handleExampleRequest(
                          method as HTTP_METHOD,
                          api.servers?.[0].url ?? "",
                          path,
                          parameters,
                          requestBody
                        );
                        if (response) {
                          setExampleResponse(JSON.stringify(response, null, 2));
                        }
                      }}
                    >
                      Try it
                    </button>

                    <ParametersSection parameters={parameters} />
                    <RequestBodySection requestBody={requestBody} />
                    <ResponseSection responses={responses} />
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div></div>
        )}
        {exampleResponse ? (
          <div className="flex-1 mt-8 w-1/3">
            <div className="sticky top-[16px] max-w-full bg-white shadow rounded-[10px] max-h-[calc(100vh-32px)] p-6 overflow-auto">
              <h2 className="text-xl font-semibold mb-4">Response</h2>
              <pre className="text-sm bg-gray-50 p-3 rounded overflow-x-auto max-h-[calc(100vh-124px)]">
                {exampleResponse}
              </pre>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

export default App;
