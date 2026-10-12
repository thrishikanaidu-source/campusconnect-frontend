import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MarkAttendance from '../components/MarkAttendance'
import EnterMarks from '../components/EnterMarks'

export default function TeacherDashboard() {
  const [tab, setTab] = useState('attendance')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

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
        <h1>Teacher Dashboard</h1>
        <div>
          <span style={{ marginRight: 12 }}>Logged in as {user?.username}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        {tabButton('attendance', 'Mark Attendance')}
        {tabButton('marks', 'Enter Marks')}
      </div>

      {tab === 'attendance' && <MarkAttendance key="attendance" />}
      {tab === 'marks' && <EnterMarks key="marks" />}
    </div>
  )
}