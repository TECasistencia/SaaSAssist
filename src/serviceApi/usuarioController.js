import bcrypt from "bcryptjs"; // Importar la biblioteca de cifrado
import { BACKEND } from "../serviceApi/backend";

const UsuarioController = {
  InsertarUsuario: async (usuario, token) => {
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
          idPersona: usuario.idPersona,
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
  /*
  ObtenerUsuarios: async () => {
    try {
      // Realizar la solicitud GET al backend para obtener el usuario por su ID
      const response = await fetch(`${BACKEND}Usuario/Obtener/${rol}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Manejar la respuesta del servidor
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      throw error;
    }
  }, */
};

export default UsuarioController;
