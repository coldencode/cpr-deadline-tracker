import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Test API connection
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.message || 'API Connected!'))
      .catch(err => setMessage('Error connecting to API'))
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>CPR Deadline Tracker</h1>
        <p>{message || 'Loading...'}</p>
        <p>React Frontend is running!</p>
      </header>
    </div>
  )
}

export default App
