import React from "react";
import { Card, CardContent } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import "./styles/styleInicio.css";

function CameraCard({ title, estado, onClick }) {
  return (
    <div className="cameraCard">
      <Card onClick={onClick}>
        <CardContent className="cameraContent">
          <div className="title">{title}</div>
          <div className="iconContainer">
            <VideocamIcon fontSize="inherit" />
          </div>
          <span
            className={`statusText${
              estado === "Offline" ? " Offline" : " Online"
            }`}
          >
            {estado}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}

export default CameraCard;
