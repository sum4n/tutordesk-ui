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
    // Read the server's JSON error body. The backend returns
    // { error: "..." } for AppError and { error, details } for
    // validation failures. Without this, every failure surfaces as
    // "API Error: 401" and the login page cannot tell the user
    // whether the password was wrong or the account does not exist.
    const body: unknown = await response.json().catch(() => null)

    const message =
      body !== null &&
      typeof body === "object" &&
      "error" in body &&
      typeof body.error === "string"
        ? body.error
        : `Request faild with status ${response.status}`

    throw new Error(message)
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
