import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/styleViewCamera.css";
import ModalListAssist from "../modals/ModalListAssist";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import FaceRecognitionController from "../serviceApi/FaceRecognitionController";

function ViewCamera() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const courseInfo = location.state?.courseInfo;
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState(localStorage.getItem("taskId") || null);
  const [status, setStatus] = useState("");
  const [latestImage, setLatestImage] = useState(null);

  // Efecto para inicializar la verificación si hay un taskId en el localStorage al cargar el componente
  useEffect(() => {
    const initialTaskId = localStorage.getItem("taskId");
    if (initialTaskId) {
      setTaskId(initialTaskId);
    }
  }, []);

  // Efecto para manejar cambios en el taskId
  useEffect(() => {
    if (taskId) {
      const interval = setInterval(async () => {
        try {
          const response = await FaceRecognitionController.CheckTaskStatus(
            taskId
          );
          console.log("CheckTaskStatus: " + response.status);
          if (response.status === "Canceled" || response.status === "Error") {
            localStorage.removeItem("taskId");
            setIsLoading(false);
            setTaskId(null);
            clearInterval(interval);
          } else if (response.status === "Running") {
            const imageBlob = await FaceRecognitionController.GetLatestImage();
            if (imageBlob !== 404) {
              setLatestImage(imageBlob);
            }
          }
          setResponse(response.status);
        } catch (error) {
          console.error("Error checking task status:", error);
          clearInterval(interval);
        }
      }, 5000);
      return () => clearInterval(interval);
    } else {
      console.log("No task id");
    }
  }, [taskId]);

  const handleStartFaceRecognition = async () => {
    try {
      const data = {
        idCurso: "IA_IC101",
        cameraIndex: 0,
      };

      // se corre el script y si el resultado es exitoso, se almacena el taskId en el local storage
      const response = await FaceRecognitionController.RunScriptFaceRecognition(
        data
      );
      setTimeout(2000);
      if (response.taskId) {
        setIsLoading(true);
        setTaskId(response.taskId);
        localStorage.setItem("taskId", response.taskId);
      }
      // datos que devuelve al ejecutar el script de reconocimiento
      console.log(
        "response RunScriptFaceRecognition taskId: " + response.taskId
      );
    } catch (error) {
      setError(error.message);
      setResponse("");
    }
  };

  // puede que este metodo se necesite agregar lo que pasa cuando se echa para atras en la pagina o si se cierra,
  // tambien ver si se guarda para que siga si vuelve a abrirse
  const handleCancelFaceRecognition = async () => {
    const taskId = localStorage.getItem("taskId");
    if (taskId) {
      try {
        // Se da la indicacion para cancelar el script
        const response = await FaceRecognitionController.CancelScript(taskId);

        setResponse(response.message);
        if (response.message !== "Task not found") {
          const status = await checkStatus();
          if (status === "Canceled") {
            localStorage.removeItem("taskId");
            setIsLoading(false);
            setTaskId(null);
            setLatestImage(null);
          } else if (status === "Not Found") {
            console.log("no se encontro la task en el API");
          }
        }
      } catch (error) {
        console.log("Error CancelScript: " + error.message);
      }
    } else {
      console.log("No task to cancel");
    }
  };

  const checkStatus = async () => {
    const taskId = localStorage.getItem("taskId");
    if (taskId) {
      try {
        const response = await FaceRecognitionController.CheckTaskStatus(
          taskId
        );
        return response.status;
      } catch (error) {
        return "Error";
      }
    }
  };
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Header />
      <Box
        sx={{
          flex: "1 0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          textAlign: "center",
        }}
      >
        <div>
          <Button
            sx={{ position: "absolute", top: 20, left: 20 }}
            variant="outlined"
            onClick={handleOpenModal}
          >
            Lista de Asistencia
          </Button>

          {!isLoading && !latestImage && (
            <Button variant="outlined" onClick={handleStartFaceRecognition}>
              Iniciar Reconocimiento
            </Button>
          )}
          {isLoading && !latestImage && (
            <CircularProgress size={50} sx={{ marginTop: "20%" }} />
          )}

          {latestImage && (
            <>
              <img
                src={latestImage}
                alt="Reconocimiento Facial"
                style={{ maxWidth: "100%", maxHeight: "80vh" }}
              />
              <Button
                sx={{ position: "absolute", top: 20, right: 20 }}
                variant="outlined"
                onClick={handleCancelFaceRecognition}
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          PaperProps={{ style: { minHeight: "50vh" } }}
        >
          <DialogContent>
            <ModalListAssist alumnos={courseInfo.Alumnos} />
          </DialogContent>
          <DialogActions>
            <div className="button-container">
              <Button sx={{ mt: 2 }} color="error" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </Box>
      <Footer sx={{ flexShrink: 0 }} />
    </div>
  );
}

export default ViewCamera;
