import { useState, useEffect } from 'react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export default function EntityManager({ title, endpoint, fields }) {
  const emptyForm = Object.fromEntries(fields.map((f) => [f.name, '']))
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await axios.get(API + endpoint)
      setItems(res.data)
    } catch (err) {
      setError('Could not load data. Is the backend running?')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const data = {}
    fields.forEach((f) => {
      data[f.name] = f.type === 'number' ? Number(form[f.name]) : form[f.name]
    })
    try {
      await axios.post(API + endpoint, data)
      setForm(emptyForm)
      load()
    } catch (err) {
      setError('Could not save. Please check the values.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return
    try {
      await axios.delete(`${API}${endpoint}/${id}`)
      load()
    } catch (err) {
      setError('Could not delete.')
    }
  }

  const cell = { border: '1px solid #ccc', padding: 8, textAlign: 'left' }

  return (
    <div>
      <h2>{title}</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        {fields.map((f) => (
          <input
            key={f.name}
            type={f.type || 'text'}
            placeholder={f.label}
            value={form[f.name]}
            onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
            required
            style={{ padding: 8, marginRight: 8, marginBottom: 8 }}
          />
        ))}
        <button type="submit" style={{ padding: '8px 16px' }}>Add</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={cell}>ID</th>
            {fields.map((f) => (
              <th key={f.name} style={cell}>{f.label}</th>
            ))}
            <th style={cell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={cell}>{item.id}</td>
              {fields.map((f) => (
                <td key={f.name} style={cell}>{item[f.name]}</td>
              ))}
              <td style={cell}>
                <button onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 && <p>No records yet.</p>}
    </div>
  )
}