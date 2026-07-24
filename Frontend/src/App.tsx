import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("http://localhost:3000/api/hello");

      if (!response.ok) {
        throw new Error (`Eror: ${response.status}`);
      }

      const data = await response.json();
      setMessage(data.message);
    }
    loadData();

  }, []);
  console.log(`message captured: ${message}`)
  return (
    <div>
      <h1>{message}</h1>
    </div>
  )

}

export default App