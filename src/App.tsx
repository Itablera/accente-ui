import React from 'react';
import logo from './logo.svg';
import './App.css';
import MarkdownEditor from './components/MarkdownEditor';

function App() {
  return (
    <div className="App">
      <h1>Live Markdown Editor</h1>
      <MarkdownEditor />
    </div>
  );
}

export default App;
