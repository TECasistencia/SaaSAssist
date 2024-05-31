import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CameraCard from "./CameraCard";
import StartCamera from "../modals/StartCamera";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { Link } from "react-router-dom";
import FaceRecognitionController from "../serviceApi/FaceRecognitionController";

const initialCameras = [
  { title: "Cámara 1", estado: "Offline" },
  { title: "Cámara 2", estado: "Offline" },
  { title: "Cámara 3", estado: "Offline" },
];

function PageInicio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCameraTitle, setSelectedCameraTitle] = useState("");
  const [cameras, setCameras] = useState(initialCameras);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);

  const handleCardClick = (title) => {
    setSelectedCameraTitle(title);
    setIsModalOpen(true);
  };

  const runFaceRecognitionScript = async () => {
    try {
      await FaceRecognitionController.RunScriptFaceRecognition();
    } catch (error) {
      console.error(
        "Error al ejecutar el script de reconocimiento facial: ",
        error
      );
    }
  };
  const handleRunScript = async () => {
    try {
      const data = {
        Arg1: "Hola",
        Arg2: "Buenas",
        Arg3: "Juan",
      };
      const response = await FaceRecognitionController.RunScriptExtractImages(
        data
      );
      setResponse(response.result);
      setError("");
    } catch (error) {
      setError(error.message);
      setResponse("");
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleStart = () => {
    // Cambia el estado de la cámara seleccionada a "online"
    const updatedCameras = cameras.map((camera) => ({
      ...camera,
      estado: camera.title === selectedCameraTitle ? "Online" : "Offline",
    }));

    // Si hay otra cámara en línea, la pone en línea automáticamente
    const onlineCamerasCount = updatedCameras.filter(
      (camera) => camera.estado === "Online"
    ).length;
    if (onlineCamerasCount > 1) {
      updatedCameras.forEach((camera) => {
        if (
          camera.title !== selectedCameraTitle &&
          camera.estado === "Online"
        ) {
          camera.estado = " Offline";
        }
      });
    }

    setCameras(updatedCameras);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageUrl = await FaceRecognitionController.GetLatestImage();
        setImage(imageUrl);
      } catch (error) {
        console.error("Error fetching the image: ", error);
      }
    };

    const interval = setInterval(fetchImage, 10000); // Fetch every 10 seconds
    fetchImage(); // Fetch immediately on mount

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);
  return (
    <div>
      <Header />
      <Box sx={{ flexGrow: 1 }} className="box">
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {cameras.map((camera, index) => (
            <Grid item xs={2} key={index}>
              <CameraCard
                title={camera.title}
                estado={camera.estado}
                onClick={() => handleCardClick(camera.title)}
              />
            </Grid>
          ))}
          <Button
            variant="outlined"
            sx={{ height: "3rem", alignSelf: "center" }}
            onClick={runFaceRecognitionScript}
          >
            Test
          </Button>
          <div>
            <h1>Reconocimiento Facial</h1>
            {image && <img src={image} alt="Reconocimiento Facial" />}
          </div>
        </Grid>
      </Box>

      <Dialog open={isModalOpen}>
        <DialogContent>
          <StartCamera
            handleClose={handleClose}
            cameraTitle={selectedCameraTitle}
            professorName={"Jorge Velazco"}
            onStart={handleStart}
          />
        </DialogContent>
        <DialogActions>
          <div className="button-container">
            <Link to={"/ViewCamera"}>
              <Button sx={{ mt: 2 }} onClick={handleStart}>
                Iniciar
              </Button>
            </Link>

            <Button sx={{ mt: 2 }} color="error" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </DialogActions>
      </Dialog>
      <Footer />
    </div>
  );
}

export default PageInicio;
