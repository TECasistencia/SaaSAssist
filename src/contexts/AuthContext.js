import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Función para realizar la autenticación mediante API
  const authenticate = async (username, password) => {
    try {
      const response = await fetch(
        "http://localhost:5066/api/Usuario/Autenticar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre_Usuario: username,
            password: password,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error de autenticación:", error.message);
      // Si ocurre algún error, retornamos false
      setIsAuthenticated(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ authenticate, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
