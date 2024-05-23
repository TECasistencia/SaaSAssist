import bcrypt from "bcryptjs"; // Importar la biblioteca de cifrado
import { BACKEND } from "./Backend";

const UsuarioController = {
  InsertUser: async (usuario, id, token) => {
    try {
      // Generar el hash de la contraseña
      const hashedPassword = await bcrypt.hash(usuario.password, 10); // 10 es el número de rondas de cifrado
      // Realizar la solicitud POST al backend
      const response = await fetch(BACKEND + "Usuario/Insertar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idPersona: id,
          idOrganizacion: usuario.idOrganizacion,
          nombreUsuario: usuario.nombreUsuario,
          password: hashedPassword, // Utilizar el hash de la contraseña en lugar de la contraseña en texto plano
          rol: usuario.rol,
          fechaAlta: usuario.fechaAlta,
          activo: usuario.activo,
        }),
      });

      // Manejar la respuesta del servidor
      if (!response.ok) {
        throw new Error("Error al insertar el usuario");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al insertar el usuario:", error);
      throw error;
    }
  },
  DeleteUser: async (nombreUsuario, token) => {
    try {
      const response = await fetch(
        BACKEND + "Usuario/Eliminar?nombreUsuario=" + nombreUsuario,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al eliminar el usuario");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      throw error;
    }
  },
  getUsers: async (Rol, token) => {
    try {
      const response = await fetch(
        `${BACKEND}Usuario/ObtenerPorRol?Rol=${Rol}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al insertar la persona");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al insertar la persona:", error);
      throw error;
    }
  },
};

export default UsuarioController;
