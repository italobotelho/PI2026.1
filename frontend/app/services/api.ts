import axios from 'axios';

// Cria uma instância do Axios apontando para o seu Backend FastAPI
const api = axios.create({
  baseURL: 'http://localhost:8000/api', 
  timeout: 10000, // Dá 10 segundos para a API responder antes de dar erro
});

export default api;