import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = 'http://localhost:8080'

export default function StudentDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const studentId = user?.linkedId

  const [student, setStudent] = useState(null)
  const [courses, setCourses] = useState([])
  const [marks, setMarks] = useState([])
  const [records, setRecords] = useState([])
  const [percentage, setPercentage] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!studentId) {
      setError('This login is not linked to a student. Ask the Admin to set the Linked ID.')
      return
    }
    const load = async () => {
      try {
        const [s, c, m, r, p] = await Promise.all([
          axios.get(`${API}/api/students/${studentId}`),
          axios.get(`${API}/api/courses`),
          axios.get(`${API}/api/marks/student/${studentId}`),
          axios.get(`${API}/api/attendance/student/${studentId}`),
          axios.get(`${API}/api/attendance/student/${studentId}/percentage`),
        ])
        setStudent(s.data)
        setCourses(c.data)
        setMarks(m.data)
        setRecords(r.data)
        setPercentage(p.data)
      } catch (err) {
        setError('Could not load your data. Is the backend running?')
      }
    }
    load()
  }, [studentId])

  const logout = () => {
    localStorage.removeItem('user')
    navigate('/')
  }

  const courseLabel = (id) => {
    const c = courses.find((x) => x.id === id)
    return c ? `${c.courseCode} - ${c.courseName}` : id
  }

  // attendance per course
  const perCourse = {}
  records.forEach((r) => {
    if (!perCourse[r.courseId]) perCourse[r.courseId] = { total: 0, present: 0 }
    perCourse[r.courseId].total += 1
    if (r.status === 'PRESENT') perCourse[r.courseId].present += 1
  })

  // marks summary
  const totalObtained = marks.reduce((sum, m) => sum + m.marksObtained, 0)
  const totalMax = marks.reduce((sum, m) => sum + m.maxMarks, 0)
  const marksPercent = totalMax > 0 ? ((totalObtained * 100) / totalMax).toFixed(1) : 0

  const cell = { border: '1px solid #ccc', padding: 8, textAlign: 'left' }
  const lowAttendance = percentage < 75 && records.length > 0

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <style>{`@media print { .no-print { display: none; } }`}</style>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Student Dashboard</h1>
        <div className="no-print">
          <button style={{ marginRight: 8 }} onClick={() => window.print()}>
            Print Result Sheet
          </button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {student && (
        <div style={{ marginBottom: 24 }}>
          <h2>{student.name}</h2>
          <p>
            Roll Number: {student.rollNumber} | Department: {student.department} | Email: {student.email}
          </p>
        </div>
      )}

      {student && (
        <>
          <h2>Attendance</h2>
          <p style={{ fontSize: 20 }}>
            Overall: <strong>{percentage.toFixed(1)}%</strong>
          </p>
          {lowAttendance && (
            <p style={{ color: 'red' }}>Warning: your attendance is below 75%.</p>
          )}

          <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 24 }}>
            <thead>
              <tr>
                <th style={cell}>Course</th>
                <th style={cell}>Classes Held</th>
                <th style={cell}>Present</th>
                <th style={cell}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(perCourse).map((id) => (
                <tr key={id}>
                  <td style={cell}>{courseLabel(Number(id))}</td>
                  <td style={cell}>{perCourse[id].total}</td>
                  <td style={cell}>{perCourse[id].present}</td>
                  <td style={cell}>
                    {((perCourse[id].present * 100) / perCourse[id].total).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {records.length === 0 && <p>No attendance recorded yet.</p>}

          <h2>Marks</h2>
          <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 12 }}>
            <thead>
              <tr>
                <th style={cell}>Course</th>
                <th style={cell}>Exam</th>
                <th style={cell}>Marks</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((m) => (
                <tr key={m.id}>
                  <td style={cell}>{courseLabel(m.courseId)}</td>
                  <td style={cell}>{m.examType}</td>
                  <td style={cell}>{m.marksObtained} / {m.maxMarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {marks.length === 0 && <p>No marks entered yet.</p>}
          {marks.length > 0 && (
            <p>
              Total: <strong>{totalObtained} / {totalMax}</strong> ({marksPercent}%)
            </p>
          )}
        </>
      )}
    </div>
  )
}