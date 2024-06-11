import { BACKEND } from "../serviceApi/Backend";

const FaceRecognitionController = {
  RunScriptDownloadAndGenerate: async (data) => {
    try {
      const response = await fetch(
        BACKEND + "FaceRecognition/DownloadAndGenerate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al ejecutar el script: ${errorData.errors}`);
      } else {
        return await response.json();
      }
    } catch (error) {
      console.error("Error de conexión con el servidor: ", error);
      throw error;
    }
  },

  RunScriptFaceRecognition: async (data) => {
    try {
      const response = await fetch(
        BACKEND + "FaceRecognition/RunFaceRecognition",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idCurso: data.idCurso,
            cameraIndex: data.cameraIndex,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al ejecutar el script: ${errorData.errors}`);
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

  CancelScript: async (taskId) => {
    try {
      const response = await fetch(
        BACKEND + "FaceRecognition/CancelFaceRecognition",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ taskId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al cancelar el script: ${errorData.errors}`);
      } else {
        return await response.json();
      }
    } catch (error) {
      console.error("Error de conexión con el servidor: ", error);
      throw error;
    }
  },

  CheckTaskStatus: async (taskId) => {
    try {
      const response = await fetch(
        BACKEND + `FaceRecognition/TaskStatus?taskId=${taskId}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error al consultar el estado de la tarea: ${errorData.errors}`
        );
      } else {
        return await response.json();
      }
    } catch (error) {
      console.error("Error de conexión con el servidor: ", error);
      throw error;
    }
  },

  GetLatestImage: async () => {
    try {
      const response = await fetch(BACKEND + "FaceRecognition/GetLatestImage");
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
