import React, { useState } from "react";
import {
  Box,
  MenuItem,
  FormControl,
  FormLabel,
  Typography,
  TextField,
} from "@mui/material";
import "../styles/styleStartCamera.css";

function StartCamera({ cameraTitle, professorName }) {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");

  const options = [
    { value: "opcion1", label: "Introducción a la Programación" },
    { value: "opcion2", label: "QA" },
    { value: "opcion3", label: "Diseño de Software" },
  ];

  const classrooms = [
    { value: "Aula 101", label: "Aula 101" },
    { value: "Aula 102", label: "Aula 102" },
    { value: "Aula 103", label: "Aula 103" },
  ];

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const handleClassroomChange = (event) => {
    setSelectedClassroom(event.target.value);
  };

  return (
    <div className="container-modal">
      <h2>Iniciar Cámara</h2>
      <Box>
        <div>
          <Typography variant="h6" gutterBottom>
            Título de la Cámara: {cameraTitle}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Profesor: {professorName}
          </Typography>
          <br />
          <FormControl fullWidth>
            <FormLabel>Selecciona una clase:</FormLabel>
            <TextField
              id="outlined"
              select
              label="Seleccione una opción"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
          <FormControl fullWidth>
            <br />
            <FormLabel>Selecciona un aula disponible:</FormLabel>
            <TextField
              id="outlined"
              select
              label="Seleccione un aula"
              value={selectedClassroom}
              onChange={handleClassroomChange}
            >
              {classrooms.map((classroom) => (
                <MenuItem key={classroom.value} value={classroom.value}>
                  {classroom.label}
                </MenuItem>
              ))}
            </TextField>
          </FormControl>
        </div>
      </Box>
    </div>
  );
}

export default StartCamera;
