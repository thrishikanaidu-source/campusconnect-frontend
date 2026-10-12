import { useState, useEffect } from 'react'
import axios from 'axios'

const API = 'http://localhost:8080'

export default function EnterMarks() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [marks, setMarks] = useState([])
  const [form, setForm] = useState({
    studentId: '',
    courseId: '',
    examType: 'Mid-1',
    marksObtained: '',
    maxMarks: '25',
  })
  const [message, setMessage] = useState('')

  const loadMarks = async () => {
    try {
      const res = await axios.get(API + '/api/marks')
      setMarks(res.data)
    } catch (err) {
      setMessage('Could not load marks.')
    }
  }

  useEffect(() => {
    const load = async () => {
      try {
        const s = await axios.get(API + '/api/students')
        const c = await axios.get(API + '/api/courses')
        setStudents(s.data)
        setCourses(c.data)
        setForm((f) => ({
          ...f,
          studentId: s.data.length > 0 ? String(s.data[0].id) : '',
          courseId: c.data.length > 0 ? String(c.data[0].id) : '',
        }))
      } catch (err) {
        setMessage('Could not load students or courses.')
      }
    }
    load()
    loadMarks()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await axios.post(API + '/api/marks', {
        studentId: Number(form.studentId),
        courseId: Number(form.courseId),
        examType: form.examType,
        marksObtained: Number(form.marksObtained),
        maxMarks: Number(form.maxMarks),
      })
      setForm({ ...form, marksObtained: '' })
      setMessage('Marks saved.')
      loadMarks()
    } catch (err) {
      setMessage('Could not save marks.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry?')) return
    try {
      await axios.delete(`${API}/api/marks/${id}`)
      loadMarks()
    } catch (err) {
      setMessage('Could not delete.')
    }
  }

  const studentName = (id) => {
    const s = students.find((x) => x.id === id)
    return s ? s.name : id
  }
  const courseName = (id) => {
    const c = courses.find((x) => x.id === id)
    return c ? c.courseCode : id
  }

  const cell = { border: '1px solid #ccc', padding: 8, textAlign: 'left' }
  const input = { padding: 8, marginRight: 8, marginBottom: 8 }

  return (
    <div>
      <h2>Enter Marks</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <select style={input} value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}>
          {students.map((s) => (
            <option key={s.id} value={s.id}>{s.rollNumber} - {s.name}</option>
          ))}
        </select>
        <select style={input} value={form.courseId}
          onChange={(e) => setForm({ ...form, courseId: e.target.value })}>
          {courses.map((c) => (
            <option key={c.id} value={c.id}>{c.courseCode} - {c.courseName}</option>
          ))}
        </select>
        <select style={input} value={form.examType}
          onChange={(e) => setForm({ ...form, examType: e.target.value })}>
          <option>Mid-1</option>
          <option>Mid-2</option>
          <option>Assignment</option>
          <option>Lab</option>
          <option>Semester</option>
        </select>
        <input style={input} type="number" placeholder="Marks obtained" value={form.marksObtained}
          onChange={(e) => setForm({ ...form, marksObtained: e.target.value })} required />
        <input style={input} type="number" placeholder="Max marks" value={form.maxMarks}
          onChange={(e) => setForm({ ...form, maxMarks: e.target.value })} required />
        <button type="submit" style={{ padding: '8px 16px' }}>Save</button>
      </form>

      {message && <p>{message}</p>}

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={cell}>Student</th>
            <th style={cell}>Course</th>
            <th style={cell}>Exam</th>
            <th style={cell}>Marks</th>
            <th style={cell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {marks.map((m) => (
            <tr key={m.id}>
              <td style={cell}>{studentName(m.studentId)}</td>
              <td style={cell}>{courseName(m.courseId)}</td>
              <td style={cell}>{m.examType}</td>
              <td style={cell}>{m.marksObtained} / {m.maxMarks}</td>
              <td style={cell}>
                <button onClick={() => handleDelete(m.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {marks.length === 0 && <p>No marks entered yet.</p>}
    </div>
  )
}