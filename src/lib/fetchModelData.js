import { apiGet } from "./api";

// Backwards-compatible fetchModel: takes a path (e.g. "/user/list"), performs
// an authenticated GET against the backend, and resolves with the JSON data.
export default function fetchModel(path) {
  return apiGet(path);
}
