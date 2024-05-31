import { BACKEND } from "../serviceApi/Backend";

const CursoController = {
  InsertCurso: async (curso, token) => {
    try {
      const response = await fetch(BACKEND + "Curso/Insertar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idOrganizacion: curso.idOrganizacion,
          codigoCurso: curso.codigoCurso,
          nombre: curso.nombre,
          nombreVariante: curso.nombreVariante,
          descripcion: curso.descripcion,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al insertar el curso");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al insertar el curso:", error);
      throw error;
    }
  },

  UpdateCurso: async (curso, token) => {
    try {
      const response = await fetch(BACKEND + "Curso/Modificar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: curso.id,
          codigoCurso: curso.codigoCurso,
          nombre: curso.nombre,
          nombreVariante: curso.nombreVariante,
          descripcion: curso.descripcion,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al modificar el curso");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al modificar el curso:", error);
      throw error;
    }
  },

  DeleteCurso: async (id, token) => {
    try {
      const response = await fetch(BACKEND + `Curso/Eliminar?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el curso");
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar el curso:", error);
      throw error;
    }
  },

  GetCursos: async (idOrganizacion, token) => {
    try {
      const response = await fetch(
        BACKEND + `Curso/Buscar?idOrganizacion=${idOrganizacion}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener los cursos");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los cursos:", error);
      throw error;
    }
  },
};

export default CursoController;
