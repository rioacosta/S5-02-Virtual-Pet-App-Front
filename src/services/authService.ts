// src/services/authService.js
const API_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/api/v1";

export async function login(username, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

export async function register(userData) {
  const response = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Registration failed");
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    console.warn("Respuesta no es JSON válido:", text);
    return {};
  }
}


