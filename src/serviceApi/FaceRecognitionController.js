import { BACKEND } from "../serviceApi/Backend";

const FaceRecognitionController = {

  RunScriptTrainModel: async (data) => {
    try {
      const response = await fetch(BACKEND + "FaceRecognition/TrainModel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

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
        throw new Error(
          `React: Error al ejecutar el script: ${errorData.errors}`
        );
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("React: Error de conexión con el servidor: ", error);
      throw error;
    }
  },

  RunScriptFaceRecognitionCNN: async (data) => {
    try {
      const response = await fetch(
        BACKEND + "FaceRecognition/RunFaceRecognitionCNN",
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
        throw new Error(
          `React: Error al ejecutar el script: ${errorData.errors}`
        );
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("React: Error de conexión con el servidor: ", error);
      throw error;
    }
  },

  GetLatestImage: async () => {
    try {
      const response = await fetch(BACKEND + "FaceRecognition/GetLatestImage");
      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } else {
        console.error("Error fetching the image");
      }
    } catch (error) {
      console.error("Error fetching the image: ", error);
    }
  },
};

export default FaceRecognitionController;
