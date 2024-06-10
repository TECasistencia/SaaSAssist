import { BACKEND } from "../serviceApi/Backend";

const FaceRecognitionController = {
  RunScriptExtractImages: async (data) => {
    try {
      const response = await fetch(
        BACKEND + "FaceRecognition/RunScriptExtractImages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Arg1: data.Arg1,
            Arg2: data.Arg2,
            Arg3: data.Arg3,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al ejecutar el script: ${errorData.errors}`);
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error de conexión con el servidor: ", error);
      throw error;
    }
  },

  RunScriptFaceRecognition: async () => {
    try {
      const response = await fetch(
        BACKEND + "FaceRecognition/RunScriptFaceRecognition",
        {
          method: "POST",
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

  RunScriptFaceRecognitionCNN: async () => {
    try {
      const response = await fetch(
        BACKEND + "FaceRecognition/RunScriptFaceRecognitionCNN",
        {
          method: "POST",
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
