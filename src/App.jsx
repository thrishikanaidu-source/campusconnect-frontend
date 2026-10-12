import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'

function ProtectedRoute({ role, children }) {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  if (!user || user.role !== role) {
    return <Navigate to="/" />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute role="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/teacher" element={<ProtectedRoute role="TEACHER"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/student" element={<ProtectedRoute role="STUDENT"><StudentDashboard /></ProtectedRoute>} />
    </Routes>
  )
}