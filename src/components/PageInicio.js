import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CameraCard from "./CameraCard";
import StartCamera from "../modals/StartCamera";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

function PageInicio() {
  const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [selectedCameraTitle, setSelectedCameraTitle] = useState("");
  const [cameras, setCameras] = useState([]);

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoDevices.length > 0) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          stream.getTracks().forEach((track) => track.stop());

          const cameraList = videoDevices.map((device, index) => ({
            title: `Cámara ${index + 1} - ${device.label || "Sin etiqueta"}`,
            deviceId: device.deviceId,
          }));
          setCameras(cameraList);
          setIsPermissionDialogOpen(false);
        } else {
          setIsPermissionDialogOpen(true);
        }
      } catch (error) {
        console.error("Error al verificar permisos:", error);
        setIsPermissionDialogOpen(true);
      }
    };

    checkPermissions();
  }, []);

  const handleCardClick = (title) => {
    setSelectedCameraTitle(title);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handlePermissionRequest = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((track) => track.stop());
      setIsPermissionDialogOpen(false);

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      const cameraList = videoDevices.map((device, index) => ({
        title: `Cámara ${index + 1} - ${device.label || "Sin etiqueta"}`,
        deviceId: device.deviceId,
      }));
      setCameras(cameraList);
    } catch (error) {
      console.error("Error al solicitar permisos:", error);
      alert("No se pudieron obtener los permisos para acceder a la cámara.");
    }
  };

  const handleStart = (courseInfo) => {
    setIsModalOpen(false);
    navigate("/ViewCamera", { state: { courseInfo } });
  };

  return (
    <div>
      <Header />
      <Box sx={{ flexGrow: 1 }} className="box">
        {cameras.length > 0 ? (
          <Grid
            container
            rowSpacing={3}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            {cameras.map((camera, index) => (
              <Grid item xs={2} key={index}>
                <CameraCard
                  title={camera.title}
                  onClick={() => handleCardClick(camera.title)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h3" align="center" color="textSecondary">
            En este momento no se detectan cámaras, por favor verifica los
            dispositivos multimedia
          </Typography>
        )}
      </Box>

      <Dialog open={isModalOpen}>
        <DialogContent>
          <StartCamera
            handleClose={handleClose}
            cameraTitle={selectedCameraTitle}
            onStart={handleStart}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isPermissionDialogOpen}>
        <DialogTitle>Permiso para acceder a la cámara</DialogTitle>
        <DialogContent>
          <Typography>
            Esta aplicación necesita acceder a su cámara. Por favor, otorgue
            permisos para continuar.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handlePermissionRequest} color="primary">
            Otorgar permisos
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
}

export default PageInicio;
