import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard';
import {createDevice} from './api/devices';




function App() { // Runs when page starts

  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/hello`);

      if (!response.ok) {
        throw new Error (`Eror: ${response.status}`);
      }

      const data = await response.json();
      setDevices(data.devices);
    }
    loadData();

  }, []);

  
  const handleCreateDevice = async (data: { name: string; status: string; localIp: string }) => {
    try {
      const result = await createDevice(data);
      setDevices([...devices, result.device])
    } catch (error) {
      console.log(`Error creating device: ${error}`);
    }
  };


  return (
    <Dashboard
      devices={devices}
      loading={false}
      onUnlock={(id) => {
        console.log('unlock', id);
      }}
      onDelete={(id) => {
        console.log('delete', id);
      }}
      onCreateDevice={(data) => {
        handleCreateDevice(data)
        console.log('create', data);
      }}
    />
  )

}

export default App