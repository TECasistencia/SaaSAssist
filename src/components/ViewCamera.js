import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/styleViewCamera.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import videoSource from "../media/Facial.mp4";
import ViewListAssist from "../modals/ViewListAssist";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Slider,
  Typography,
} from "@mui/material";

function ViewCamera() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [divHidden, setDivHidden] = useState(false);
  const initialEmotionsData = {
    Felicidad: 0,
    Ira: 0,
    Tristeza: 0,
    Miedo: 0,
    Sorpresa: 0,
  };
  const [emotionsData, setEmotionsData] = useState(initialEmotionsData);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSliderChange = (emotion, value) => {
    setEmotionsData((prevEmotionsData) => ({
      ...prevEmotionsData,
      [emotion]: value,
    }));
  };

  const getSliderLabel = (emotion) => {
    return (
      <Typography variant="body2" gutterBottom>
        {emotion}
      </Typography>
    );
  };

  const handleCheckboxChange = () => {
    setDivHidden(!divHidden);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulación de carga de la lista de emociones
      const newEmotionsData = {
        Felicidad: Math.floor(Math.random() * 101),
        Ira: Math.floor(Math.random() * 101),
        Tristeza: Math.floor(Math.random() * 101),
        Miedo: Math.floor(Math.random() * 101),
        Sorpresa: Math.floor(Math.random() * 101),
      };
      setEmotionsData(newEmotionsData);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
          <div className="emotions-sliders">
            {Object.entries(emotionsData).map(([emotion, value]) => (
              <div key={emotion} className="slider-wrapper">
                {getSliderLabel(emotion)}
                <Slider
                  className={`slider-${emotion}`}
                  value={value}
                  aria-labelledby="continuous-slider"
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  onChange={(event, newValue) =>
                    handleSliderChange(emotion, newValue)
                  }
                  components={{
                    Thumb: () => null,
                  }}
                />
              </div>
            ))}
          </div>
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
