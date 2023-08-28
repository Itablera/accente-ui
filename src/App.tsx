import React from 'react';
import logo from './logo.svg';
import './App.css';
import MarkdownEditor from './components/MarkdownEditor';
import CodeEditor from './components/CodeEditor';

function App() {
  return (
    <div className="App">
      <CodeEditor />
      <MarkdownEditor />
    </div>
  );
}

export default App;
