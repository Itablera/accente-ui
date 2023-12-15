import React from 'react';
import logo from './logo.svg';
import './App.css';
import MarkdownEditor from './components/MarkdownEditor';
import CodeEditor from './components/CodeEditor';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BlockPage from './pages/BlockPage';
import ListBlocksPage from './pages/ListBlocksPage';
import EditorLabPage from './pages/EditorLab';
import { BlockService } from './services/BlockService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
    <div className="App">
      <Router>
          <Routes>
              <Route path="/" element={<ListBlocksPage />} />
              <Route path="/block" element={<BlockPage />} />
              <Route path="/block/:id" element={<BlockPage />} />
              <Route path="/lab" element={<EditorLabPage />} />
              {/* Add more routes as needed */}
          </Routes>
      </Router>
    </div>
    </QueryClientProvider>
  );
}

export default App;
