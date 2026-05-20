import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './widgets/Layout';
import { DashboardPage } from './pages/Dashboard';
import { SpreadsheetPage } from './pages/Spreadsheet';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {}
        <Route path="/documents/:id" element={<SpreadsheetPage />} />
        {}
        <Route path="/test-sheet" element={<SpreadsheetPage />} /> 
      </Routes>
    </Layout>
  );
}

export default App;