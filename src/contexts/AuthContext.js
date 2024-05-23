import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Importar jwtDecode como una función nombrada
import { BACKEND } from "../serviceApi/Backend";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPrincipal, setIsPrincipal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInvited, setIsInvited] = useState(false);
  const [dataUser, setDataUser] = useState();
  const [token, setToken] = useState();

  const determinarRol = (decodedToken) => {
    const rol = parseInt(decodedToken.Rol);

    switch (rol) {
      case 1:
        console.log("Es principal");
        setIsPrincipal(true);
        setIsAdmin(false);
        setIsInvited(false);
        break;
      case 2:
        console.log("Es administrador");
        setIsPrincipal(false);
        setIsAdmin(true);
        setIsInvited(false);
        break;
      case 3:
        console.log("Es invitado");
        setIsPrincipal(false);
        setIsAdmin(false);
        setIsInvited(true);
        break;
      default:
        console.log("Rol no reconocido");
        setIsPrincipal(false);
        setIsAdmin(false);
        setIsInvited(false);
        break;
    }
  };

  const authenticate = async (username, password) => {
    try {
      const response = await fetch(BACKEND + "Usuario/Autenticar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_Usuario: username,
          password: password,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Respuesta inesperada del servidor");
      }

      const data = await response.json();

      const token = data.token;
      console.log(token);
      setToken(token);

      const decodedToken = jwtDecode(token);

      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }

      if (decodedToken.Activo === "True") {
        setIsAuthenticated(true);
        setDataUser(decodedToken);
      }

      determinarRol(decodedToken);

      return true;
    } catch (error) {
      console.error("Error de autenticación:", error.message);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authenticate,
        isAuthenticated,
        isAdmin,
        isInvited,
        isPrincipal,
        dataUser,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
