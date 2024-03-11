import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/styleViewCamera.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import videoSource from "../media/Facial.mp4";
import ViewListAssist from "../modals/ViewListAssist";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import EmotionsChart from "./EmotionsChart";

function ViewCamera() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [divHidden, setDivHidden] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckboxChange = () => {
    setDivHidden(!divHidden);
  };

  return (
    <div>
      <Header />
      <div className="video-container">
        <video className="video" controls>
          <source src={videoSource} type="video/mp4" />
        </video>
        <div className="menu-container">
          <MoreVertIcon className="VertIcon" onClick={handleMenuClick} />
          {menuOpen && (
            <div className="menu-dropdown">
              <label>
                <input
                  type="checkbox"
                  checked={divHidden}
                  onChange={handleCheckboxChange}
                />
                Mostrar emociones
              </label>
              <div className="button-container">
                <Button
                  sx={{ width: "100%" }}
                  variant="outlined"
                  onClick={handleOpenModal}
                >
                  Lista de Asistencia
                </Button>
              </div>
            </div>
          )}
        </div>
        {divHidden && (
          <EmotionsChart orientation="horizontal" position="top-right" />
        )}
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogContent>
            <ViewListAssist />
          </DialogContent>
          <DialogActions>
            <div className="button-container">
              <Button sx={{ mt: 2 }} color="error" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </div>
          </DialogActions>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
}

export default ViewCamera;
