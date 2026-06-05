import { API_BASE_URL } from "./config.js";

async function request(path, options = {}) {

  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      ...options
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `HTTP ${response.status}: ${text}`
    );
  }

  if(response.status===204){
    return null;
  }

  return response.json();

}

export function getPasses() {

  return request("/passes",{
    headers:{
      "X-Demo-UserId":"1"
    }
  });

}

export function createPass(dto) {

  return request("/passes",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "X-Demo-UserId":"1"
    },
    body:JSON.stringify(dto)
  });

}

export function deletePass(id){

  return request(`/passes/${id}`,{
    method:"DELETE",
    headers:{
      "X-Demo-UserId":"1"
    }
  });

}
export function getHealth() {
  return fetch("http://localhost:3000/health")
    .then(r => r.json());
}

export function getPassesCount() {
  return request("/passes/count");
}

export function getPassesWithLogs() {
  return request("/passes-with-logs");
}

export function searchPasses(user) {
  return fetch(
    `http://localhost:3000/api/passes/search?user=${user}`
  ).then(r => r.json());
}

export function seedData() {
  return fetch("http://localhost:3000/seed")
    .then(r => r.json());
}

export function getPassById(id) {

  console.log("Запитую ID:", id);

  return request(`/passes/${id}`, {
    headers: {
      "X-Demo-UserId": "1"
    }
  });

} 

export function updatePass(id) {
  return request(`/passes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Demo-UserId": "1"
    },
    body: JSON.stringify({
      user: "Максим",
      reason: "Study",
      date: "2026-06-01",
      comment: "Оновлено"
    })
  });
}

export function createUser() {
  return request("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: "TestUser",
      email: "test@test.com"
    })
  });
}

export function getUser(id) {
  return request(`/users/${id}`);
}

export function getTopUsers() {
  return request("/passes/top-users");
}
