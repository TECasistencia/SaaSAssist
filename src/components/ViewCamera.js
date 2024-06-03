import React, { useState } from "react";
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
} from "@mui/material";
import { useLocation } from "react-router-dom";

function ViewCamera() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const courseInfo = location.state?.courseInfo;

  console.log(courseInfo);

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
      <Box sx={{ flex: "1 0 auto" }}>
        <Button
          sx={{ top: 16, left: 16 }}
          variant="outlined"
          onClick={handleOpenModal}
        >
          Lista de Asistencia
        </Button>

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
