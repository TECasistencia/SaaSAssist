import { createContext, useState } from "react";
import { jwtDecode } from "jwt-decode"; // Importar jwtDecode correctamente
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
        setIsPrincipal(true);
        setIsAdmin(false);
        setIsInvited(false);
        break;
      case 2:
        setIsPrincipal(false);
        setIsAdmin(true);
        setIsInvited(false);
        break;
      case 3:
        setIsPrincipal(false);
        setIsAdmin(false);
        setIsInvited(true);
        break;
      default:
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Error al iniciar sesión, verifica los datos ingresados y vuelve a intentarlo"
        );
      }

      const token = data.token;
      setToken(token);

      const decodedToken = jwtDecode(token);

      if (decodedToken.Activo === "True") {
        setIsAuthenticated(true);
        setDataUser(decodedToken);
      }

      determinarRol(decodedToken);

      return true;
    } catch (error) {
      throw error;
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
