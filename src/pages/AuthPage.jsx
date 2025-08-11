import { useEffect, useState } from "react";
import { login, register } from "../services/authService";
import backgroundImage from "../assets/the-temple.png";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired } from "../utils/authUtils";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const apiUrl = import.meta.env.VITE_API_BASE_URL //|| "http://localhost:8080";
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [logoutMessage, setLogoutMessage] = useState("");
  const [loggedOutUser, setLoggedOutUser] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const logoutFlag = localStorage.getItem("loggedOut");
  const lastUser = localStorage.getItem("userId");

  if (logoutFlag === "true") {
    localStorage.setItem("loggedOut", "pending");

    setTimeout(() => {
      toast.info(`Hasta pronto, ${lastUser} 🌿 Sigue respirando 🧘`, {
        position: "top-center",
        autoClose: 5000,
        theme: "light"
      });

      localStorage.removeItem("loggedOut");
      localStorage.removeItem("userId");
    }, 100);
  }
}, []);



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
        console.log("TOKEN DECODIFICADO:", decoded);
        const roles = decoded.roles || [];

        localStorage.setItem("token", token);
        localStorage.setItem("userId", decoded.userId || decoded.id || decoded.sub);
        localStorage.setItem("roles", JSON.stringify(roles));
        console.log("Guardado en localStorage roles:", localStorage.getItem("roles"));

        toast.success("Login exitoso");

        setTimeout(() => {
          console.log("Roles:", roles); // 👈 Verificación antes de navegar

          if (Array.isArray(roles) && roles.includes("ROLE_ADMIN")) {
            toast.info("Redirigiendo al panel de administrador 🛠️");
            window.location.href = "/admin";  // Cambio a navegación forzada para refrescar estado
          } else {
            //toast.info("Redirigiendo al panel de usuario 🧘");
            navigate("/dashboard");
          }
        }, 1000);

      } else {
        await register(form);
        toast.success("Registro alineado, ${username}. Ahora puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error");
      toast.error("Error al hacer login, credenciales incorrectas")
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "fixed",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "left",
        alignItems: "flex-start", // <-- Esto lo pega arriba
        top: "-190px",           // Distancia desde arriba (puedes ajustar)
        padding: "4rem",
        }}
    >

      <img
         src="/assets/title31.png" // Cambialo al nombre real de tu logo
         alt="Logo de la app"
         style={{
           position: "absolute",
           top: "-230px",           // Distancia desde arriba (puedes ajustar)
           left: "50%",
           transform: "translateX(-50%)",
           width: "520px",        // Ajustá tamaño
           zIndex: 2,
           pointerEvents: "none"  // Permite clickear lo que está debajo
         }}
       />

      <div
        style={{
          background:  "rgba(255, 245, 238, 0.50)",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: 300,
          textAlign: "center",
          marginTop: '150px'

        }}
      >
        <h2 style={{ color: "#4169E1" }}>
          {isLogin ? "Iniciar sesión" : "Registrarse"}
        </h2>

        {logoutMessage && (
          <div
            style={{
              background: "#dff0d8",
              color: "#3c763d",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              fontWeight: "bold",
              textAlign: "center",
              opacity: logoutMessage ? 1 : 0,
              transition: "opacity 0.6s ease-in-out"
            }}
          >
            {logoutMessage}
          </div>
        )}

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
              color: "#1E90FF",
              cursor: "pointer"
            }}
          >
            {isLogin ? "Registrarse" : "Iniciar sesión"}
          </button>
        </p>
      </div>
    </div>
  );
}
