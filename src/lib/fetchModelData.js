const BASE_URL = "https://ckfrc6-8081.csb.app/api"; // ĐỔI thành URL backend của bạn

let currentUser = null;
export function setCurrentUser(u) { currentUser = u; }

function fetchModel(url, options = {}) {
  const { method = "GET", body } = options;
  const headers = {};
  if (currentUser) headers["x-user-id"] = currentUser._id;
  if (body) headers["Content-Type"] = "application/json";

  return fetch(BASE_URL + url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  }).then((res) => {
    if (!res.ok) return res.json().then((e) => Promise.reject(e));
    return res.json().then((data) => ({ data }));
  });
}
export default fetchModel;
