export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
  };

  // put token in req header
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });

  // if receive 401 -> go to login page
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return null;
  }

  return res;
}
