import { useState } from "react";
import { login, register } from "../services/authService";
import backgroundImage from "../assets/the-temple.png"; // Asegúrate de que el nombre del archivo sea correcto

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        const data = await login(form.username, form.password);
        localStorage.setItem("token", data.token);
        alert("Login exitoso"); //quizas hay que quitarlo
        window.location.href = "/dashboard"; // Aquí puedes redirigir al dashboard
      } else {
        await register(form);
        alert("Registro exitoso. Ahora puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: 400,
          textAlign: "center"
        }}
      >
        <h2>{isLogin ? "Iniciar sesión" : "Registrarse"}</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            name="username"
            placeholder="Usuario"
            value={form.username}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <input
              name="email"
              placeholder="Correo"
              value={form.email}
              onChange={handleChange}
              required
            />
          )}
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? "Entrar" : "Registrarse"}</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <p>
          {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} style={{ background: "none", border: "none", color: "blue", cursor: "pointer" }}>
            {isLogin ? "Registrarse" : "Iniciar sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
