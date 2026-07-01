import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:5000/api",
});

export async function listLeads({
  q = "",
  status = "",
  limit = 10,
  offset = 0,
} = {}) {
  const { data } = await http.get("/leads", {
    params: { q, status, limit, offset },
  });

  return data;
}

export async function getLead(id) {
  const { data } = await http.get(`/lead/${id}`);

  return data;
}

export async function updateLead(id, patch) {
  const { data } = await http.patch(`/leads/${id}`, patch);

  return data;
}

export async function getStats() {
  const { data } = await http.get("/stats");

  return data;
}
