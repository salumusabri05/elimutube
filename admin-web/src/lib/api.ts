export function getApiBase() {
  if (typeof window !== 'undefined') {
    const env = localStorage.getItem('api_env');
    if (env === 'local') return 'http://localhost:3000';
    if (env === 'production') return 'https://elimutube-production.up.railway.app';
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://elimutube-production.up.railway.app';
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const API_BASE = getApiBase();
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}/${endpoint.replace(/^\//, '')}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'An error occurred';
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
