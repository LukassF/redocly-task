import type { ParameterObject } from "openapi-typescript";
import { HTTP_METHOD } from "../types/enums";

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
