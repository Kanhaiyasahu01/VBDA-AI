import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layout/DashboardLayout';
import Upload from './pages/Upload';
import PreviewEdit from './pages/PreviewEdit';
import ScheduleBulk from './pages/ScheduleBulk';
import Analytics from './pages/Analytics';
import Respond from './components/Respond';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Upload />} />
        <Route path="preview-edit" element={<PreviewEdit />} />
        <Route path="schedule-bulk" element={<ScheduleBulk />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      <Route path="/respond" element={<Respond />} />
      </Routes>
  );
};

export default App;
