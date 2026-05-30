import { API_BASE } from "./config";

// --- Token + user persistence (survives page refresh) --------------------
const TOKEN_KEY = "photoapp_token";
const USER_KEY = "photoapp_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}
export function setStoredUser(user) {
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(USER_KEY);
}

// --- Core request helper --------------------------------------------------
// Prepends the API base, attaches the Bearer token, parses the response,
// and throws an Error (with the server's message) when the request fails.
async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  // Only set JSON content-type when sending a plain (non-FormData) body.
  const isFormData = options.body instanceof FormData;
  if (options.body && !isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // 401 => token is missing/expired: drop it so the app redirects to login.
  if (response.status === 401) {
    setToken(null);
    setStoredUser(null);
  }

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === "string" ? payload : payload.message || "Request failed";
    throw new Error(message);
  }
  return payload;
}

export function apiGet(path) {
  return request(path, { method: "GET" });
}
export function apiPost(path, body) {
  return request(path, { method: "POST", body: JSON.stringify(body) });
}
// For multipart file uploads (do NOT set Content-Type manually).
export function apiUpload(path, formData) {
  return request(path, { method: "POST", body: formData });
}
