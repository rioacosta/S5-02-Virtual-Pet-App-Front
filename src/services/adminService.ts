// src/services/adminService.ts
const ADMIN_API =
  (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080") + "/api/admin";

export interface BuddysDTO {
  id: string;
  name: string;
  level: number;
  avatarUrl?: string;
}

export interface AdminUserWithBuddysDTO {
  id: string;
  username: string;
  email: string;
  enabled: boolean;
  roles: string[];
  createdAt: string;
  lastLogin?: string;
  Buddys: BuddysDTO[];
}

export async function fetchUsersWithBuddys(): Promise<AdminUserWithBuddysDTO[]> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${ADMIN_API}/users-with-buddys`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cargar usuarios");
  return res.json();
}

export async function toggleUserEnabled(username: string): Promise<void> {
  const token = localStorage.getItem("token");
  await fetch(`${ADMIN_API}/users/${username}/toggle-enabled`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createAdmin(payload: {
  username: string;
  email: string;
  password: string;
}): Promise<void> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${ADMIN_API}/create-admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al crear administrador");
  }
}

export async function updateUserData(username: string, payload: {
  email?: string;
  username?: string;
}): Promise<void> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${ADMIN_API}/users/${username}/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al actualizar datos del usuario");
}

export async function updateUserRoles(username: string, roles: string[]): Promise<string[]> {
  const token = localStorage.getItem("token");
  const res = await fetch(`${ADMIN_API}/users/${username}/roles`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(roles),
  });
  if (!res.ok) throw new Error("Error al actualizar roles");
  return res.json();
}

export async function deleteUser(username: string): Promise<void> {
  const token = localStorage.getItem("token");
  await fetch(`${ADMIN_API}/${username}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}
