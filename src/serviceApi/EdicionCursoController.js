import { BACKEND } from "../serviceApi/Backend";

const EdicionCursoController = {
  InsertEdicionCurso: async (edicionCurso, token) => {
    try {
      console.log(edicionCurso);
      const response = await fetch(BACKEND + "EdicionCurso/Insertar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          IdCurso: edicionCurso.IdCurso,
          IdPeriodo: edicionCurso.IdPeriodo,
          IdEspacio: edicionCurso.IdEspacio,
          IdPersona: edicionCurso.IdProfesor,
          NombreGrupo: edicionCurso.NombreGrupo,
          FechaInicio: edicionCurso.FechaInicio,
          FechaFin: edicionCurso.FechaFin,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al insertar la edición del curso");
      }

      const data = await response.json();
      return data;
    } catch (error) {
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
        if (response.status === 404) {
          const errorData = await response.json();
          throw new Error(errorData.errorMessage);
        } else {
          throw new Error("Error al obtener las ediciones del curso");
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
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
          Id: id,
          NombreGrupo: edicionCurso.NombreGrupo,
          IdEspacio: edicionCurso.IdEspacio,
          IdPeriodo: edicionCurso.IdPeriodo,
          IdPersona: edicionCurso.IdProfesor,
          FechaInicio: edicionCurso.FechaInicio,
          FechaFin: edicionCurso.FechaFin,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al modificar la edición del curso");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  },
};

export default EdicionCursoController;
