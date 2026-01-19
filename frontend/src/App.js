// import logo from './logo.svg';
import './App.css';
import DashboardPage from './pages/DashboardPage';
import PeoplePage from './pages/PeoplePage';
import SessionsPage from './pages/SessionsPage';
import AppLayout from "./components/layout/AppLayout";
import {Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}> 
      {/* always render the layout first */}
        <Route index element={<DashboardPage />} />
        {/* path= "/" */}
        <Route path="people" element={<PeoplePage />} />
        <Route path="sessions" element={<SessionsPage />} />
      </Route>
    </Routes>
    
  )
}

export default App;
