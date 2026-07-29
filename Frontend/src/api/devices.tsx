const API_URL = import.meta.env.VITE_API_URL;

// gonna be used for jwt authentication  token 
function authHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function createDevice(data: { name: string; status: string; localIp: string }) {
  const response = await fetch(`${API_URL}/api/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
}

export async function deleteDevice(id: string) {
  const response = await fetch(`${API_URL}/api/devices/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
}

export async function updateDeviceStatus(id: string, status: string) {
  const response = await fetch(`${API_URL}/api/status/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json();
}