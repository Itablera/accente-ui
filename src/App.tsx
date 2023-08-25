import React from 'react';
import logo from './logo.svg';
import './App.css';
import MarkdownEditor from './components/MarkdownEditor';
import MarkdownEditormdx from './components/MarkdownEditor-mdx';

function App() {
  return (
    <div className="App">
      <h1>uix Markdown Editor</h1>
      <MarkdownEditor />
      <h1>mdx Markdown Editor</h1>
      <MarkdownEditormdx />
    </div>
  );
}

export default App;
