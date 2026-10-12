import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import EntityManager from '../components/EntityManager'
import CreateLogin from '../components/CreateLogin'

const studentFields = [
  { name: 'name', label: 'Name' },
  { name: 'rollNumber', label: 'Roll Number' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'department', label: 'Department' },
]

const teacherFields = [
  { name: 'name', label: 'Name' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'department', label: 'Department' },
]

const courseFields = [
  { name: 'courseName', label: 'Course Name' },
  { name: 'courseCode', label: 'Course Code' },
  { name: 'credits', label: 'Credits', type: 'number' },
]

export default function AdminDashboard() {
  const [tab, setTab] = useState('students')
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  const tabButton = (key, label) => (
    <button
      onClick={() => setTab(key)}
      style={{
        padding: '8px 16px',
        marginRight: 8,
        fontWeight: tab === key ? 'bold' : 'normal',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Admin Dashboard</h1>
        <button onClick={logout}>Logout</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        {tabButton('students', 'Students')}
        {tabButton('teachers', 'Teachers')}
        {tabButton('courses', 'Courses')}
        {tabButton('logins', 'Create Login')}
      </div>

      {tab === 'students' && (
        <EntityManager key="students" title="Students" endpoint="/api/students" fields={studentFields} />
      )}
      {tab === 'teachers' && (
        <EntityManager key="teachers" title="Teachers" endpoint="/api/teachers" fields={teacherFields} />
      )}
      {tab === 'courses' && (
        <EntityManager key="courses" title="Courses" endpoint="/api/courses" fields={courseFields} />
      )}
      {tab === 'logins' && <CreateLogin />}
    </div>
  )
}
