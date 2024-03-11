import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CameraCard from "./CameraCard";
import StartCamera from "../modals/StartCamera";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { Link } from "react-router-dom";

const initialCameras = [
  { title: "Título de la cámara 1", estado: "Offline" },
  { title: "Título de la cámara 2", estado: "Offline" },
  { title: "Título de la cámara 3", estado: "Offline" },
];

function PageInicio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCameraTitle, setSelectedCameraTitle] = useState("");
  const [cameras, setCameras] = useState(initialCameras);

  const handleCardClick = (title) => {
    setSelectedCameraTitle(title);
    setIsModalOpen(true);
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
