import React, {  } from 'react';
import MonacoEditor from "@monaco-editor/react";
import { transpile } from 'typescript';
import { CodeBlockEditorDescriptor } from '@mdxeditor/editor';


const CodeEditor: React.FC = () => {  
  const [code, setCode] = React.useState("//Just a comment");

  function handleEditorChange(value: any, event: any) {
    setCode(value);
  }

  const executeCode = () => {
    const iframe = document.createElement('iframe');
    document.body.appendChild(iframe);

    try {
      const compiledCode = transpile(code);
      //@ts-ignore
      iframe.contentWindow?.eval(compiledCode);
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

export function MonacoEditorPlugin() {
  return {
    // The regex captures content between triple backticks and the specified language (e.g., ```javascript ... ```)
    trigger: /```(\w+)?\s([\s\S]+?)```/g,
    replace: (match: any, lang: any, codeContent: any) => {
      return (
        <MonacoEditor
          language={lang || 'javascript'}
          value={codeContent}
          onChange={(newValue) => {
            // Handle value change, you might want to propagate the changes back to mdx-editor
          }}
        />
      );
    }
  };
}

export const monacoPlugin: CodeBlockEditorDescriptor = {
  priority: 0,
  match: function (language: string, meta: string): boolean {
    throw new Error('Function not implemented.');
  },
  Editor: CodeEditor
}

export default CodeEditor;
