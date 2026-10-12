import { useState } from 'react'
import axios from 'axios'

export default function CreateLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STUDENT')
  const [linkedId, setLinkedId] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        username,
        password,
        role,
        linkedId: linkedId === '' ? null : Number(linkedId),
      })
      setMessage('Login created for ' + username)
      setUsername('')
      setPassword('')
      setLinkedId('')
    } catch (err) {
      setMessage('Could not create login. The username may already exist.')
    }
  }

  const input = { padding: 8, marginRight: 8, marginBottom: 8 }

  return (
    <div>
      <h2>Create Login</h2>
      <p>
        Use the ID from the Students or Teachers tab as the "Linked ID", so the
        login is connected to that person.
      </p>
      <form onSubmit={handleSubmit}>
        <input style={input} placeholder="Username" value={username}
          onChange={(e) => setUsername(e.target.value)} required />
        <input style={input} type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
        <select style={input} value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="STUDENT">STUDENT</option>
          <option value="TEACHER">TEACHER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <input style={input} type="number" placeholder="Linked ID" value={linkedId}
          onChange={(e) => setLinkedId(e.target.value)} />
        <button type="submit" style={{ padding: '8px 16px' }}>Create</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}