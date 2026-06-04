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

export function getPassesCount() {
  return request("/passes/count");
}
