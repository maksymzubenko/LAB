import { API_BASE_URL } from "./config.js";

const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 10000);

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  if (response.status === 204) return null;

  return await response.json();
}

export function getPasses() {
  return request("/passes");
}

export function createPass(dto) {
  return request("/passes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dto)
  });
}

export function deletePass(id) {
  return request(`/passes/${id}`, {
    method: "DELETE"
  });
}