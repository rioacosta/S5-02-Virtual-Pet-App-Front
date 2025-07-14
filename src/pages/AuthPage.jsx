import { useState } from "react";
import { login, register } from "../services/authService";
import backgroundImage from "../assets/the-temple.png";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "../utils/authUtils";

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
        const token = data.token;

        if (!token || isTokenExpired(token)) {
          throw new Error("Token inválido o expirado");
        }

        const decoded = jwtDecode(token);
        const roles = decoded.roles || [];

        localStorage.setItem("token", token);
        localStorage.setItem("userId", decoded.userId || decoded.id || decoded.sub);
        localStorage.setItem("roles", JSON.stringify(roles));

        toast.success("Login exitoso");

        // 🔮 Redirige según el rol
        if (Array.isArray(roles) && roles.includes("ROLE_ADMIN")) {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
        } else {
        await register(form);
        toast.success("Registro exitoso. Ahora puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error");
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
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <h2>{isLogin ? "Iniciar sesión" : "Registrarse"}</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
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
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: "none",
              border: "none",
              color: "blue",
              cursor: "pointer",
            }}
          >
            {isLogin ? "Registrarse" : "Iniciar sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
