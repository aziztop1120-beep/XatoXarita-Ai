import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import TeacherRoute from './components/TeacherRoute.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import UpdatePassword from './pages/UpdatePassword.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Tests from './pages/Tests.jsx';
import ErrorMap from './pages/ErrorMap.jsx';
import Topics from './pages/Topics.jsx';
import Results from './pages/Results.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/error-map" element={<ErrorMap />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/results" element={<Results />} />
          <Route path="/profile" element={<Profile />} />
          <Route element={<TeacherRoute />}>
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
