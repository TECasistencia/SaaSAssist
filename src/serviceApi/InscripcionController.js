import { BACKEND } from "./Backend";

const InscripcionController = {
  InsertMultipleInscripciones: async (inscripciones, token) => {
    try {
      const response = await fetch(BACKEND + "Inscripcion/InsertarMultiples", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inscripciones),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.error || "Error al insertar las inscripciones"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  SearchInscripcion: async (idEdicionCurso, token) => {
    try {
      const response = await fetch(
        `${BACKEND}Inscripcion/Buscar?idEdicionCurso=${idEdicionCurso}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No se encontraron inscripciones");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },

  DeleteInscripcion: async (id, token) => {
    try {
      const response = await fetch(`${BACKEND}Inscripcion/Eliminar?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la inscripción");
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  UpdateInscripcion: async (inscripcion, token) => {
    try {
      const response = await fetch(BACKEND + "Inscripcion/Modificar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: inscripcion.id,
          fechaInscripcion: inscripcion.fechaInscripcion,
          estado: inscripcion.estado,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al modificar la inscripción");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default InscripcionController;
