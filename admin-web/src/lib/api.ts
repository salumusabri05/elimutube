export function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL || 'https://elimutube-production.up.railway.app';
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  const API_BASE = getApiBase();
  
  const headers: Record<string, string> = {
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  Object.assign(headers, options.headers);

  const url = `${API_BASE}/${endpoint.replace(/^\//, '')}`;
  console.log(`[API Request] fetching: ${url}`);

  const response = await fetch(url, {
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
