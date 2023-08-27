import React, { useState } from 'react';
import MonacoEditor from 'react-monaco-editor';


const CodeEditor: React.FC = () => {  
  const [code, setCode] = useState<string>('console.log("Hello, TypeScript!");');

  const handleCodeChange = (newValue: string) => {
    setCode(newValue);
  };

  const executeCode = () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    try {
      //@ts-ignore
      iframe.contentWindow?.eval(code);
    } catch (error) {
      console.error("Error executing code:", error);
    }

    document.body.removeChild(iframe);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={executeCode}>Run</button>
      </div>
      <MonacoEditor
        width="800"
        height="600"
        language="typescript"
        theme="vs-dark"
        value={code}
        options={
          {
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: "line",
            automaticLayout: false
          }
        }
        onChange={handleCodeChange}
      />
    </div>
  );
};

export default CodeEditor;
