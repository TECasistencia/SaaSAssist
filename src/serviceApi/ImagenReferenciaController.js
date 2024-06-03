import { BACKEND } from "./Backend";

const ImagenReferenciaController = {
  InsertarImagenReferencia: async (imagenReferencia, token) => {
    try {
      for (const ref of imagenReferencia) {
        const response = await fetch(BACKEND + "ImagenesReferencia/Insertar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idPersona: ref.IdPersona,
            rutaArchivo: ref.RutaArchivo,
            fechaCarga: ref.FechaCarga,
            usadaParaEntrenamiento: ref.Usado,
          }),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error(
            "Error al insertar la imagen de referencia:",
            errorResponse
          );
          throw new Error(
            errorResponse.error || "Error al insertar la imagen de referencia"
          );
        }
      }
      return { message: "Imágenes de referencia insertadas correctamente" };
    } catch (error) {
      console.error("Error al insertar la imagen de referencia:", error);
      throw error;
    }
  },

  EliminarImagenReferencia: async (id, token) => {
    try {
      const response = await fetch(
        BACKEND + `ImagenesReferencia/Eliminar?id=${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.error || "Error al eliminar la imagen de referencia"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al eliminar la imagen de referencia:", error);
      throw error;
    }
  },

  ModificarImagenReferencia: async (imagenReferencia, token) => {
    try {
      for (const ref of imagenReferencia) {
        const response = await fetch(BACKEND + "ImagenesReferencia/Modificar", {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: ref.id,
            idPersona: ref.IdPersona,
            rutaArchivo: ref.RutaArchivo,
            fechaCarga: ref.FechaCarga,
            usadaParaEntrenamiento: ref.Usado,
          }),
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error(
            "Error al modificar la imagen de referencia:",
            errorResponse
          );
          throw new Error(
            errorResponse.error || "Error al modificar la imagen de referencia"
          );
        }
      }
      return { message: "Imágenes de referencia modificadas correctamente" };
    } catch (error) {
      console.error("Error al modificar la imagen de referencia:", error);
      throw error;
    }
  },

  BuscarImagenesReferenciaPorCurso: async (idCurso, token) => {
    try {
      const response = await fetch(
        BACKEND + `ImagenesReferencia/BuscarPorCurso?idCurso=${idCurso}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          errorResponse.error ||
            "Error al buscar las imágenes de referencia por curso"
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        "Error al buscar las imágenes de referencia por curso:",
        error
      );
      throw error;
    }
  },
};

export default ImagenReferenciaController;
