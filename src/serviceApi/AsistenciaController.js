import { BACKEND } from "../serviceApi/Backend";

const AsistenciaController = {
  // Otros métodos...

  BuscarAsistenciaPorFecha: async (fecha, token) => {
    try {
      const response = await fetch(
        `${BACKEND}Asistencia/BuscarPorFecha?fecha=${fecha}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Error al buscar asistencias por fecha"
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Error al buscar asistencias por fecha:", error);
      throw error;
    }
  },
};

export default AsistenciaController;
