import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        username,
        password,
      })
      localStorage.setItem('user', JSON.stringify(res.data))
      const role = res.data.role
      if (role === 'ADMIN') navigate('/admin')
      else if (role === 'TEACHER') navigate('/teacher')
      else navigate('/student')
    } catch (err) {
      setError('Invalid username or password')
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: '80px auto', fontFamily: 'sans-serif' }}>
      <h1>CampusConnect</h1>
      <p>Student Attendance and Result Management Portal</p>
      <form onSubmit={handleLogin}>
        <input
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 12 }}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={{ display: 'block', width: '100%', padding: 8, marginBottom: 12 }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={{ padding: '8px 16px' }} type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}