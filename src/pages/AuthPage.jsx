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
          console.log("Roles:", roles); // 👈 Verificación

          if (Array.isArray(roles) && roles.includes("ROLE_ADMIN")) {
            toast.info("Redirigiendo al panel de administrador 🛠️");
            window.location.href = "/admin";  // Cambio a navegación forzada
          } else {
            //toast.info("Redirigiendo al panel de usuario 🧘");
            navigate("/dashboard");
          }
        }, 1000);

        } else {
              try {
                await register(form);
                toast.success(`Registro alineado, ${form.username}. Ahora puedes iniciar sesión.`);
                setIsLogin(true);
              } catch (err) {
                if (err.type === "validation") {
                  err.errors = { password: "Password should have at least 6 characters" };
                  const mensajes = Object.values(err.errors).join("\n");
                  setError(mensajes);
                  toast.error(mensajes);
                } else {
                  setError(err.message || "Ocurrió un error en el registro");
                  toast.error(err.message || "Ocurrió un error en el registro");
                }
              }
            }
          } catch (err) {
            setError(err.message || "Ocurrió un error");
            toast.error(err.message || "Ocurrió un error");
          }
        };

return (
  <div
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "1rem",
    }}
  >
    {/* TÍTULO */}
    <img
      src="/assets/title31.png"
      alt="Logo de la app"
      style={{
        maxWidth: "90%",
        height: "auto",
        marginBottom: "1.5rem",
      }}
    />

    {/* FORMULARIO */}
    <div
      style={{
        background: "rgba(255, 245, 238, 0.6)",
        padding: "2rem",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "320px",
        textAlign: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}
    >
      <h2 style={{ color: "#4169E1" }}>
        {isLogin ? "Iniciar sesión" : "Registrarse"}
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required/>
        {!isLogin && (
          <input name="email" placeholder="Correo" value={form.email} onChange={handleChange} required/>
        )}
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required/>
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