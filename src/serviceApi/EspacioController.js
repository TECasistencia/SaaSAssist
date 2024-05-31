import { BACKEND } from "../serviceApi/Backend";

const EspacioController = {
  InsertSpace: async (space, token) => {
    try {
      const response = await fetch(BACKEND + "Espacio/Insertar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdOrganizacion: space.idOrganizacion,
          nombre: space.name,
          capacidad: space.capacity,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al insertar el espacio");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al insertar el espacio:", error);
      throw error;
    }
  },

  GetSpaces: async (idOrganizacion, token) => {
    try {
      const response = await fetch(
        `${BACKEND}Espacio/Buscar?idOrganizacion=${idOrganizacion}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los espacios");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los espacios:", error);
      throw error;
    }
  },

  UpdateSpace: async (space, token) => {
    try {
      const response = await fetch(BACKEND + `Espacio/Modificar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: space.id,
          nombre: space.name,
          capacidad: space.capacity,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al modificar el espacio");
      }

      return true;
    } catch (error) {
      console.error("Error al modificar el espacio:", error);
      throw error;
    }
  },

  DeleteSpace: async (id, token) => {
    try {
      const response = await fetch(BACKEND + `Espacio/Eliminar?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el espacio");
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar el espacio:", error);
      throw error;
    }
  },
};

export default EspacioController;
