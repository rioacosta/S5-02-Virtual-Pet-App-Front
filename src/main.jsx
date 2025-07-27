//src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

// 💡 Inserta estilos globales eliminando márgenes y paddings
const globalStyles = `
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
    background-color: black; /* O el color que combine con tu fondo */
    overflow-x: hidden;
  }
  body {
    color: #4169E1;
  }
  #root {
    height: 100%;
  }
`;

// ✅ Inyectamos el CSS global en el <head> del documento
const styleTag = document.createElement("style");
styleTag.innerHTML = globalStyles;
document.head.appendChild(styleTag);

// 🎯 Renderizado principal
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
