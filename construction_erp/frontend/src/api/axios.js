import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",  // Adjust to match your Django API endpoint
  timeout: 5000,
});

export default API;
