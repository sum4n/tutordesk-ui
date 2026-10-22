const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    // TODO: Enhance this later to parse JSON error messages from real backend
    throw new Error(`API Error: ${response.status}`)
  }

  return response
}

// Simple helper methods to make hooks cleaner
export const api = {
  get: (endpoint: string) => apiRequest(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, data: T) =>
    apiRequest(endpoint, { method: "POST", body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: T) =>
    apiRequest(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (endpoint: string) => apiRequest(endpoint, { method: "DELETE" }),
}
