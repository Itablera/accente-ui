import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ListBlocksPage from './pages/ListBlocksPage';
import BlockPage from './pages/BlockPage';
import EditorLabPage from './pages/EditorLab';
import FenPage from './pages/FenPage';



function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <BrowserRouter>
              <Routes>
                  <Route path="/" element={<ListBlocksPage />} />
                  <Route path="/block" element={<BlockPage />} />
                  <Route path="/block/:id" element={<BlockPage />} />
                  <Route path="/lab" element={<EditorLabPage />} />
                  <Route path="/fen" element={<FenPage />} />
                  {/* Add more routes as needed */}
              </Routes>
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App

