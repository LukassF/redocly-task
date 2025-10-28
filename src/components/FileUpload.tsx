import { useState, type FC } from "react";
import type { OpenAPI3 } from "openapi-typescript";
import clsx from "clsx";
import { parseYamlContent } from "../utils/openapi";

interface IProps {
  onSetApi: (api: OpenAPI3) => void;
  onSetYamlRaw: (val: string) => void;
}

export const FileUpload: FC<IProps> = ({ onSetApi, onSetYamlRaw }) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = async (file: File | undefined) => {
    if (!file) return;

    try {
      setFileName(file.name);
      const text = await file.text();
      onSetYamlRaw(text);

      const apiDoc = await parseYamlContent(text);
      console.log(apiDoc);
      onSetApi(apiDoc);
      setError(null);
    } catch (err) {
      console.log(err);
      setError("Error parsing YAML file.");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-3xl font-bold mb-6">OpenAPI Preview</h1>

      <label
        className={clsx(
          "border p-4 rounded-lg shadow cursor-pointer h-[200px]",
          isDragOver ? "bg-grey-200" : "bg-white",
          fileName ? "border-green-500 border-solid border-[2px]" : ""
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".yaml,.yml"
          onChange={handleFileChange}
          className="hidden"
        />
        Upload OpenAPI YAML File
        <div className="text-center text-green-500 mt-[20px]">{fileName}</div>
      </label>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default FileUpload;
