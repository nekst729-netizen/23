import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './widgets/Layout';
import { DashboardPage } from './pages/Dashboard';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        { }
      </Routes>
    </Layout>
  );
}

export default App;