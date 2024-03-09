import React, { useRef, useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./styles/styleViewCamera.css";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import videoSource from "../media/IA_Video.mp4";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import ViewListAssist from "../modals/ViewListAssist";

function ViewCamera() {
  const [canvasHidden, setCanvasHidden] = useState(false); // Estado para rastrear si el canvas está oculto
  const [menuOpen, setMenuOpen] = useState(false); // Estado para rastrear si el menú está abierto
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para rastrear si el modal está abierto

  const handleCheckboxChange = () => {
    setCanvasHidden(!canvasHidden); // Cambia el estado del canvas entre visible e oculto
  };

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen); // Cambia el estado del menú entre abierto y cerrado
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const chartCanvasRef = useRef(null); // Canvas para la gráfica
  const emotionsData = {
    feliz: 90,
    ira: 15,
    tristeza: 50,
    miedo: 20,
    sorpresa: 100,
  };

  useEffect(() => {
    const chartCanvas = chartCanvasRef.current.getContext("2d");
    chartCanvas.font = "14px Arial"; // Establecer el tamaño de fuente

    const drawChart = () => {
      const canvasHeight = 150; // Altura fija del canvas
      const barWidth = 20; // Ancho de las barras
      const barSpacing = 40;
      let x = 20;
      let maxBarHeight = 0; // Variable para almacenar la altura máxima de la barra

      Object.entries(emotionsData).forEach(([emotion, percentage]) => {
        const barHeight = (percentage / 100) * canvasHeight; // Tamaño de la barra en relación con la altura fija del canvas
        const y = canvasHeight - barHeight;

        // Actualizar la altura máxima de la barra si es necesario
        if (barHeight > maxBarHeight) {
          maxBarHeight = barHeight;
        }

        // Dibujar fondo oscuro detrás de cada barra
        chartCanvas.fillStyle = "rgba(0, 0, 0, 0.5)";
        chartCanvas.fillRect(x, 0, barWidth, canvasHeight);

        // Dibujar la barra actual
        chartCanvas.fillStyle = getEmotionColor(emotion);
        chartCanvas.fillRect(x, y, barWidth, barHeight);

        x += barWidth + barSpacing; // Añadir espacio entre las barras
      });

      // Dibujar los nombres de las emociones debajo de las barras
      x = 20; // Restablecer la posición X para dibujar los nombres
      Object.keys(emotionsData).forEach((emotion) => {
        // Convertir la primera letra de cada palabra a mayúscula
        const emotionCapitalized =
          emotion.charAt(0).toUpperCase() + emotion.slice(1);

        const percentage = emotionsData[emotion];
        const barHeight = (percentage / 100) * canvasHeight; // Tamaño de la barra en relación con la altura fija del canvas
        const y = canvasHeight - barHeight;

        // Dibujar fondo oscuro detrás de cada barra
        chartCanvas.fillStyle = "rgba(0, 0, 0, 0.5)";
        chartCanvas.fillRect(x, 0, barWidth, canvasHeight);

        // Dibujar la barra actual
        chartCanvas.fillStyle = getEmotionColor(emotion);
        chartCanvas.fillRect(x, y, barWidth, barHeight);

        // Dibujar el nombre de la emoción debajo de la barra
        const textWidth = chartCanvas.measureText(emotionCapitalized).width;
        const textX = x + (barWidth - textWidth) / 2;
        const textY = canvasHeight + 20;

        chartCanvas.fillStyle = "white";
        chartCanvas.fillText(emotionCapitalized, textX, textY);

        x += barWidth + barSpacing; // Añadir espacio entre las barras
      });
    };

    drawChart();
  }, []);

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case "feliz":
        return "green";
      case "ira":
        return "red";
      case "tristeza":
        return "blue";
      case "miedo":
        return "orange";
      case "sorpresa":
        return "purple";
      default:
        return "black";
    }
  };

  return (
    <div>
      <Header />
      <div className="video-container">
        <video className="video" controls>
          <source src={videoSource} type="video/mp4" />
        </video>
        {/* Menú desplegable */}
        <div className="menu-container">
          <MoreVertIcon className="VertIcon" onClick={handleMenuClick} />
          {menuOpen && (
            <div className="menu-dropdown">
              {/* Contenedor para el label y el input */}
              <div className="checkbox-container">
                <label>Emociones</label>
                <input
                  type="checkbox"
                  checked={canvasHidden}
                  onChange={handleCheckboxChange}
                />
              </div>
              {/* Contenedor para el botón */}
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
        <canvas
          ref={chartCanvasRef}
          className={`chart-canvas ${canvasHidden ? "" : "hidden"}`}
          width={300} // Ancho fijo del canvas
          height={200} // Altura fija del canvas
        />
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
