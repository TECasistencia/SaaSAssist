import React, { useCallback, useContext, useEffect, useState } from "react";
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
  CircularProgress,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import FaceRecognitionController from "../serviceApi/FaceRecognitionController";
import AsistenciaController from "../serviceApi/AsistenciaController";
import { AuthContext } from "../contexts/AuthContext";
import InscripcionController from "../serviceApi/InscripcionController";

function ViewCamera() {
  const { token } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const courseInfo = location.state?.courseInfo;
  const [isLoading, setIsLoading] = useState(false);
  const [taskId, setTaskId] = useState(localStorage.getItem("taskId") || null);
  const [latestImage, setLatestImage] = useState(null);

  const navigate = useNavigate();

  // formato de fecha
  const today = new Date();
  const formattedDate = today.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  // Efecto para inicializar la verificación si hay un taskId en el localStorage al cargar el componente
  useEffect(() => {
    const initialTaskId = localStorage.getItem("taskId");
    if (initialTaskId) {
      setTaskId(initialTaskId);
    }
  }, []);

  const handleBuscarAsistencias = useCallback(async () => {
    try {
      const todayDate = new Date();

      const yyyy = todayDate.getFullYear();
      const mm = String(todayDate.getMonth() + 1).padStart(2, "0");
      const dd = String(todayDate.getDate()).padStart(2, "0");

      const date = `${yyyy}-${mm}-${dd}`;

      const asistencias = await AsistenciaController.BuscarAsistenciaPorFecha(
        date,
        token
      );
      if (asistencias) {
        const inscripciones = await InscripcionController.SearchInscripcion(
          courseInfo.IdEdicionCurso,
          token
        );
        if (inscripciones) {
        }
        asistencias.forEach((asistencia) => {
          const presente = inscripciones.find(
            (inscripcion) => inscripcion.id === asistencia.idInscripcion
          );
          if (presente) {
            courseInfo.Alumnos.forEach((alumno) => {
              if (alumno.idAlumno === presente.idAlumno) {
                if (!alumno.asistencia[0]) {
                  alumno.asistencia.push(true);
                }
              }
            });
          }
        });
      }
    } catch (error) {
      console.error("Error al buscar asistencias por fecha:", error);
    }
  }, [courseInfo.Alumnos, courseInfo.IdEdicionCurso, token]);

  useEffect(() => {
    if (taskId) {
      const interval = setInterval(async () => {
        try {
          handleBuscarAsistencias();
          const response = await FaceRecognitionController.CheckTaskStatus(
            taskId,
            token
          );
          // console.log("CheckTaskStatus: " + response.status);
          if (response.status === "Canceled" || response.status === "Error") {
            localStorage.removeItem("taskId");
            setIsLoading(false);
            setTaskId(null);
            clearInterval(interval);
          } else if (response.status === "Running") {
            // cambiarlo al dato del curso recibido del inicio
            const imageBlob = await FaceRecognitionController.GetLatestImage(
              courseInfo.IdCurso
            );
            if (imageBlob !== 404) {
              setLatestImage(imageBlob);
            }
          }
        } catch (error) {
          console.error("Error checking task status:", error);
          clearInterval(interval);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [courseInfo.IdCurso, handleBuscarAsistencias, taskId, token]);
  const handleStartFaceRecognition = async () => {
    try {
      const data = {
        idCurso: String(courseInfo.IdCurso),
        cameraIndex: 0,
      };

      // se corre el script y si el resultado es exitoso, se almacena el taskId en el local storage
      const response = await FaceRecognitionController.RunScriptFaceRecognition(
        data,
        token
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
      console.error("Error starting faceRecognition:", error.message);
    }
  };

  const handleCancelFaceRecognition = async () => {
    const taskId = localStorage.getItem("taskId");
    if (taskId) {
      try {
        // Se da la indicacion para cancelar el script
        const response = await FaceRecognitionController.CancelScript(
          taskId,
          token
        );
        if (response.message !== "Task not found") {
          const status = await checkStatus();
          if (status === "Canceled") {
            localStorage.removeItem("taskId");
            setIsLoading(false);
            setTaskId(null);
            setLatestImage(null);
            handleEndClass();
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
          taskId,
          token
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

  const handleEndClass = () => {
    // Redireccionar al inicio
    navigate("/");
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <Header />
      <Typography variant="h5" sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
        Asistencia del curso {courseInfo?.NombreCurso} - {formattedDate}
      </Typography>
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
            sx={{ position: "absolute", top: 0, left: 20 }}
            variant="outlined"
            onClick={handleOpenModal}
          >
            Lista de Asistencia
          </Button>

          {/* <Button variant="outlined" onClick={handleBuscarAsistencias}>
            test
          </Button> */}
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
                sx={{ position: "absolute", top: 0, right: 20 }}
                variant="outlined"
                onClick={handleCancelFaceRecognition}
              >
                Finalizar Clase
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
