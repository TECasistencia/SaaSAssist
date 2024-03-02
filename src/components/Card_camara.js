import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";

function CameraCard() {
  return (
    <Card>
      <CardMedia
        component="img"
        image="URL_DE_LA_IMAGEN"
        title="Título de la cámara"
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Título de la cámara
        </Typography>
        <Typography variant="body2">Descripción de la cámara</Typography>
      </CardContent>
    </Card>
  );
}

export default CameraCard;
