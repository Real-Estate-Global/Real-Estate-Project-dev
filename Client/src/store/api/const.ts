export const BASE_URL = import.meta.env.VITE_NODE_ENV === 'production' ? '/api' : "http://localhost:3000/api";

console.log('BASE_URL', import.meta.env.VITE_NODE_ENV);