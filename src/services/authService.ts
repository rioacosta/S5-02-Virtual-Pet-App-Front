// src/services/authService.js
const API_URL = (import.meta.env.VITE_API_BASE_URL) + "/api"; //|| "http://localhost:8080") + "/api";

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
    // Si es 400 con validaciones, el backend devuelve un objeto con campos
    if (response.status === 400 && data && typeof data === "object") {
      throw { type: "validation", errors: data };
    }
    // Otro tipo de error
    throw new Error(data?.message || "Registration failed");
  }

  return data;
}

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    console.warn("Respuesta no es JSON válido:", text);
    return {};
  }

}


