import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Faqat role = 'teacher' bo‘lgan foydalanuvchilar uchun (Supabase'da ma’lumotni RLS ham himoya qiladi).
export default function TeacherRoute() {
  const { profile } = useAuth();
  if (profile?.role !== 'teacher') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
