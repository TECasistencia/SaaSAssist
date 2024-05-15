import { BACKEND } from "../serviceApi/backend";

const AdminController = {
  GetAdmins: async (Rol, token) => {
    try {
      const response = await fetch(`${BACKEND}Usuario/getAdmins?Rol=${Rol}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

export default AdminController;
