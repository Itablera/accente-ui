import React, { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

const MarkdownEditor: React.FC = () => {
  const [value, setValue] = useState<string>("## Type your markdown here");

  return (
    <div>
      <MDEditor
        value={value}
        onChange={(newValue) => setValue(newValue || '')}
      />
      <div style={{ marginTop: '20px' }}>
        <MDEditor.Markdown source={value} />
      </div>
    </div>
  );
};

export default MarkdownEditor;
