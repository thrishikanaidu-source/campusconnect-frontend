import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:8080'

export default function MarkAttendance() {
  const today = new Date().toLocaleDateString('en-CA')
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [courseId, setCourseId] = useState('')
  const [date, setDate] = useState(today)
  const [status, setStatus] = useState({})
  const [message, setMessage] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const s = await axios.get(API + '/api/students')
        const c = await axios.get(API + '/api/courses')
        setStudents(s.data)
        setCourses(c.data)
        if (c.data.length > 0) setCourseId(String(c.data[0].id))
      } catch (err) {
        setMessage('Could not load students or courses.')
      }
    }
    load()
  }, [])

  const getStatus = (id) => status[id] || 'PRESENT'

  const handleSave = async () => {
    if (!courseId) {
      setMessage('Please add a course first (in the Admin dashboard).')
      return
    }
    try {
      for (const s of students) {
        await axios.post(API + '/api/attendance', {
          studentId: s.id,
          courseId: Number(courseId),
          date,
          status: getStatus(s.id),
        })
      }
      setMessage('Attendance saved for ' + students.length + ' students.')
    } catch (err) {
      setMessage('Could not save attendance.')
    }
  }

  const cell = { border: '1px solid #ccc', padding: 8, textAlign: 'left' }
  const input = { padding: 8, marginRight: 8 }

  return (
    <div>
      <h2>Mark Attendance</h2>

      <div style={{ marginBottom: 16 }}>
        <select style={input} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.courseCode} - {c.courseName}
            </option>
          ))}
        </select>
        <input style={input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <table style={{ borderCollapse: 'collapse', width: '100%', marginBottom: 16 }}>
        <thead>
          <tr>
            <th style={cell}>Roll Number</th>
            <th style={cell}>Name</th>
            <th style={cell}>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td style={cell}>{s.rollNumber}</td>
              <td style={cell}>{s.name}</td>
              <td style={cell}>
                <label style={{ marginRight: 12 }}>
                  <input
                    type="radio"
                    name={'status-' + s.id}
                    checked={getStatus(s.id) === 'PRESENT'}
                    onChange={() => setStatus({ ...status, [s.id]: 'PRESENT' })}
                  />{' '}
                  Present
                </label>
                <label>
                  <input
                    type="radio"
                    name={'status-' + s.id}
                    checked={getStatus(s.id) === 'ABSENT'}
                    onChange={() => setStatus({ ...status, [s.id]: 'ABSENT' })}
                  />{' '}
                  Absent
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {students.length === 0 && <p>No students yet. Add some in the Admin dashboard.</p>}

      <button style={{ padding: '8px 16px' }} onClick={handleSave}>Save Attendance</button>
      {message && <p>{message}</p>}
    </div>
  )
}