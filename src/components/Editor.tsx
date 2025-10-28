import { Editor } from "@monaco-editor/react";
import { useEffect, useState, type FC } from "react";

interface IProps {
  definition: string;
  onConfirm: (val: string) => void;
}
export const EditorContainer: FC<IProps> = ({ definition, onConfirm }) => {
  const [value, setValue] = useState(definition);

  useEffect(() => {
    if (!value && definition) {
      setValue(definition);
    }
  }, [definition, value]);

  return (
    <div className="w-full">
      <Editor
        height="400px"
        defaultLanguage="json"
        value={value}
        onChange={(value) => setValue(value || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
        }}
      />
      <button
        className="h-[40px] w-[200px] bg-green-400 text-white rounded-[10px] mt-[10px] hover:bg-green-500"
        onClick={() => {
          onConfirm(value);
        }}
      >
        Confirm
      </button>
    </div>
  );
};

export default EditorContainer;
