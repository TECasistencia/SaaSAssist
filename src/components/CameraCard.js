import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import "./styles/styleInicio.css";

function CameraCard() {
  return (
    <div className="cameraCard">
      <Card>
        <CardMedia
          className="cameraMedia"
          component="img"
          image="URL_DE_LA_IMAGEN"
          title="Título de la cámara"
        />
      </Card>
    </div>
  );
}

export default CameraCard;
