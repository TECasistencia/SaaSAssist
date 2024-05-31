import { BACKEND } from "../serviceApi/Backend";

const EdicionCursoController = {
  InsertEdicionCurso: async (edicionCurso, token) => {
    console.log(edicionCurso);
    try {
      const response = await fetch(BACKEND + "EdicionCurso/Insertar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idCurso: edicionCurso.IdCurso,
          idPeriodo: edicionCurso.IdPeriodo,
          idEspacio: edicionCurso.IdEspacio,
          idUsuario: edicionCurso.IdProfesor,
          nombreGrupo: edicionCurso.NombreGrupo,
          fechaInicio: edicionCurso.FechaInicio,
          fechaFin: edicionCurso.FechaFin,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al insertar la edición del curso");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al insertar la edición del curso:", error);
      throw error;
    }
  },

  GetEdicionCurso: async (idCurso, token) => {
    try {
      const response = await fetch(
        BACKEND + `EdicionCurso/Buscar?idCurso=${idCurso}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener las ediciones del curso");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener las ediciones del curso:", error);
      throw error;
    }
  },

  DeleteEdicionCurso: async (id, token) => {
    try {
      const response = await fetch(BACKEND + `EdicionCurso/Eliminar?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la edición del curso");
      }

      return true;
    } catch (error) {
      console.error("Error al eliminar la edición del curso:", error);
      throw error;
    }
  },

  UpdateEdicionCurso: async (id, edicionCurso, token) => {
    try {
      const response = await fetch(BACKEND + "EdicionCurso/Modificar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
          nombreGrupo: edicionCurso.NombreGrupo,
          idEspacio: edicionCurso.IdEspacio,
          idPeriodo: edicionCurso.IdPeriodo,
          idUsuario: edicionCurso.IdProfesor,
          fechaInicio: edicionCurso.FechaInicio,
          fechaFin: edicionCurso.FechaFin,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al modificar la edición del curso");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al modificar la edición del curso:", error);
      throw error;
    }
  },
};

export default EdicionCursoController;
