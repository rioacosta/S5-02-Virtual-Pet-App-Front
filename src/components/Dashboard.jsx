import { useEffect, useState } from "react";

export default function Dashboard() {
  const [pets, setPets] = useState([]);
  const [totalMinutes, setTotalMinutes] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/pets", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setPets(data);
        const total = data.reduce((sum, pet) => sum + (pet.totalMeditationMinutes || 0), 0);
        setTotalMinutes(total);
      })
      .catch((err) => console.error("Error al cargar mascotas:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Bienvenido a tu espacio 🧘</h1>
      <h2>Total meditado: {totalMinutes} minutos</h2>

      <button onClick={() => alert("Ir a crear mascota")}>➕ Crear nueva mascota</button>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
        {pets.map((pet) => (
          <div
            key={pet.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              width: "150px",
              textAlign: "center",
              cursor: "pointer"
            }}
            onClick={() => alert(`Ir a la página de ${pet.name}`)}
          >
            <img src={pet.avatarUrl || "/default-avatar.png"} alt={pet.name} style={{ width: "100%", borderRadius: "50%" }} />
            <h3>{pet.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
