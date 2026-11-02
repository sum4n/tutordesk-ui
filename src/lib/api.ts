const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// The shape of an error response from the backend.
// Every field is optional because a malformed body is possible.
interface ErrorDetail {
  message?: string
}

interface ErrorBody {
  error?: string
  details?: ErrorDetail[]
}

// Turn a failed HTTP response into one message the user can read.
// Priority: validation messages → server error string → status code.
async function getErrorMessage(response: Response): Promise<string> {
  let body: ErrorBody | null = null

  try {
    body = (await response.json()) as ErrorBody
  } catch {
    // The body was not JSON (HTML error page, empty body).
    // body stays null and we fall through to the status message.
  }

  // 1. Validation failures.
  //    body.error is the generic "Validation failed" — not for humans.
  //    The actual messages are in details[].message.
  if (body && Array.isArray(body.details)) {
    const messages: string[] = []

    for (const detail of body.details) {
      // `detail &&` defends against a payload like details: [null].
      // The cast above trusts the server; this check does not.
      if (detail && typeof detail.message === "string") {
        messages.push(detail.message)
      }
    }

    if (messages.length > 0) {
      return messages.join(". ")
    }
  }

  // 2. Server error string.
  //    Used for "Email already registered", "Invalid email or password",
  //    "Class not found", and any other AppError.
  if (body && typeof body.error === "string") {
    return body.error
  }

  // 3. Nothing usable in the body.
  return `Request failed with status ${response.status}`
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token")

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })
  } catch {
    // fetch() rejects on transport failure — server down, no network,
    // DNS failure. No response exists, so !response.ok never runs.
    throw new Error(
      "Could not reach the server. Check your connection and try again."
    )
  }

  if (!response.ok) {
    throw new Error(await getErrorMessage(response))
  }

  return response
}

export const api = {
  get: (endpoint: string) => apiRequest(endpoint, { method: "GET" }),
  post: <T>(endpoint: string, data: T) =>
    apiRequest(endpoint, { method: "POST", body: JSON.stringify(data) }),
  patch: <T>(endpoint: string, data: T) =>
    apiRequest(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (endpoint: string) => apiRequest(endpoint, { method: "DELETE" }),
}
