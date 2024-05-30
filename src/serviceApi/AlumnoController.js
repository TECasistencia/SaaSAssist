import { BACKEND } from "../serviceApi/Backend";

const AlumnoController = {
  InsertAlumno: async (alumno, token) => {
    try {
      const response = await fetch(BACKEND + "Alumno/Insertar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idOrganizacion: alumno.idOrganizacion,
          idPersona: alumno.idPersona,
          fechaIngreso: alumno.fechaIngreso,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al insertar el alumno");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al insertar el alumno:", error);
      throw error;
    }
  },

  GetAlumnos: async (idOrganizacion, token) => {
    try {
      const response = await fetch(
        BACKEND + `Alumno/Buscar?idOrganizacion=${idOrganizacion}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los alumnos");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los alumnos:", error);
      throw error;
    }
  },

  DeleteAlumno: async (id, token) => {
    try {
      const response = await fetch(BACKEND + `Alumno/Eliminar?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el alumno");
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar el alumno:", error);
      throw error;
    }
  },
  UpdateAlumno: async (student, token) => {
    try {
      const response = await fetch(BACKEND + "Alumno/Modificar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: student.id,
          fechaIngreso: student.fechaIngreso,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al modificar el alumno");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al modificar el alumno:", error);
      throw error;
    }
  },
};

export default AlumnoController;
