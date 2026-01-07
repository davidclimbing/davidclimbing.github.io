import { Routes, Route } from 'react-router-dom';
import { EntryPage } from './pages/EntryPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<EntryPage />} />
      <Route path="/entry/:entryId" element={<EntryPage />} />
    </Routes>
  );
}

export default App;
