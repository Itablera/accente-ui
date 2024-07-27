import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ListBlocksPage from './pages/ListBlocksPage';
import BlockPage from './pages/BlockPage';
import EditorLabPage from './pages/EditorLab';
import MdxPage from './pages/MdxPage';
import MilkdownLabPage from './pages/MilkdownLab';
import MdxCompilePage from './pages/MdxCompilePage';
import RemarkPage from './pages/RemarkPage';
import RemarkPage2 from './pages/RemarkPage2';
import RemarkEditor from './pages/RemarkEditor';
import { ClickPage } from './pages/ClickWrapper';



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
                  <Route path="/milkdown" element={<MilkdownLabPage />} />
                  <Route path="/mdx" element={<MdxPage />} />
                  <Route path="/mdxcompile" element={<MdxCompilePage />} />
                  <Route path="/remark" element={<RemarkPage />} />
                  <Route path="/remark2" element={<RemarkPage2   />} />
                  <Route path="/click" element={<ClickPage />} />
                  {/* Add more routes as needed */}
              </Routes>
          </BrowserRouter>
        </div>
      </QueryClientProvider>
    </>
  )
}

export default App

