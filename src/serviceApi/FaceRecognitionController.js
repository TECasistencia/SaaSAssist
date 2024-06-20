import { BACKEND } from "../serviceApi/Backend";

const FaceRecognitionController = {
  RunDownloadAndGenerate: async (data, token) => {
    try {
      const response = await fetch(
        BACKEND + "FaceRecognition/DownloadAndGenerate",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          const errors = Object.values(errorData.errors).flat().join(", ");
          throw new Error(
            `Error al ejecutar el script DownloadAndGenerate: ${errors}`
          );
        } else {
          const errorMessage =
            errorData.message ||
            "Error al ejecutar el script DownloadAndGenerate";
          throw new Error(errorMessage);
        }
      } else {
        return await response.json();
      }
    } catch (error) {
      console.error("Error de conexión con el servidor: ", error);
      throw error;
    }
  },

  RunScriptFaceRecognition: async (data, token) => {
    try {
      const response = await fetch(
        BACKEND + "FaceRecognition/RunFaceRecognition",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          const errors = Object.values(errorData.errors).flat().join(", ");
          throw new Error(`Error al ejecutar el script: ${errors}`);
        } else {
          const errorMessage =
            errorData.message || "Error al ejecutar el script";
          throw new Error(errorMessage);
        }
      } else {
        const result = await response.json();
        localStorage.setItem("taskId", result.taskId); // Almacenar el taskId en localStorage
        return result;
      }
    } catch (error) {
      console.error("Error de conexión con el servidor: ", error);
      throw error;
    }
  },

  CancelScript: async (taskId, token) => {
    try {
      const response = await fetch(
        BACKEND + "FaceRecognition/CancelFaceRecognition",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          const errors = Object.values(errorData.errors).flat().join(", ");
          throw new Error(`Error al cancelar el script: ${errors}`);
        } else {
          const errorMessage =
            errorData.message || "Error al cancelar el script";
          throw new Error(errorMessage);
        }
      } else {
        return await response.json();
      }
    } catch (error) {
      console.error("Error de conexión con el servidor: ", error);
      throw error;
    }
  },

  CheckTaskStatus: async (taskId, token) => {
    try {
      const response = await fetch(
        BACKEND + `FaceRecognition/TaskStatus?taskId=${taskId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          const errors = Object.values(errorData.errors).flat().join(", ");
          throw new Error(
            `Error al consultar el estado de la tarea: ${errors}`
          );
        } else {
          const errorMessage =
            errorData.message || "Error al consultar el estado de la tarea";
          throw new Error(errorMessage);
        }
      } else {
        return await response.json();
      }
    } catch (error) {
      console.error("Error de conexión con el servidor: ", error);
      throw error;
    }
  },

  GetLatestImage: async (idCurso) => {
    try {
      const response = await fetch(
        BACKEND + `FaceRecognition/GetLatestImage?idCurso=${idCurso}`
      );
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } else if (response.status === 404) {
        return 404;
      }
    } catch (error) {
      console.error("Error fetching the image: ", error);
    }
  },
};

export default FaceRecognitionController;
