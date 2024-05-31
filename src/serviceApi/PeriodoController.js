import { BACKEND } from "../serviceApi/Backend";

const PeriodoController = {
  InsertPeriod: async (period, token) => {
    try {
      const response = await fetch(BACKEND + "Periodo/Insertar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idOrganizacion: period.idOrganizacion,
          nombre: period.nombre,
          fechaInicio: period.fechaInicio,
          fechaFin: period.fechaFin,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al insertar el periodo");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al insertar el periodo:", error);
      throw error;
    }
  },

  UpdatePeriod: async (period, token) => {
    try {
      const response = await fetch(BACKEND + "Periodo/Modificar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: period.id,
          nombre: period.nombre,
          fechaInicio: period.fechaInicio,
          fechaFin: period.fechaFin,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al modificar el periodo");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al modificar el periodo:", error);
      throw error;
    }
  },

  DeletePeriod: async (id, token) => {
    try {
      const response = await fetch(BACKEND + `Periodo/Eliminar?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el periodo");
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar el periodo:", error);
      throw error;
    }
  },

  GetPeriods: async (idOrganizacion, token) => {
    try {
      const response = await fetch(
        BACKEND + `Periodo/Buscar?idOrganizacion=${idOrganizacion}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los periodos");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los periodos:", error);
      throw error;
    }
  },
};

export default PeriodoController;
