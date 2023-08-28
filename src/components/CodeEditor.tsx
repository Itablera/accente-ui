import React, { useRef, useState } from 'react';
import MonacoEditor from "@monaco-editor/react";


const CodeEditor: React.FC = () => {  
  const [code, setCode] = React.useState("//Just a comment");

  function handleEditorChange(value: any, event: any) {
    setCode(value);
  }

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

  function handleEditorDidMount(editor: any, monaco: any) {
    console.log('onMount: the editor instance:', editor);
    console.log('onMount: the monaco instance:', monaco);
  }

  function handleEditorWillMount(monaco: any) {
    console.log('beforeMount: the monaco instance:', monaco);
  }

  function handleEditorValidation(markers: any) {
    // model markers
    // markers.forEach(marker => console.log('onValidate:', marker.message));
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button onClick={executeCode}>Run</button>
      </div>
      <MonacoEditor
        height="90vh"
        defaultLanguage="typescript"
        defaultValue="// some comment"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
        onValidate={handleEditorValidation}
      />
    </div>
  )
};

export default CodeEditor;
