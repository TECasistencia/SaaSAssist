import React, { useState } from "react";
import {
  Button,
  Box,
  MenuItem,
  FormControl,
  Typography,
  TextField,
  Link,
} from "@mui/material";

function StartCamera({ handleClose, cameraTitle }) {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="container-modal">
      <h2>Iniciar Cámara</h2>
      <Box>
        <div>
          <Typography variant="h6" gutterBottom>
            Título de la Cámara: {cameraTitle}
          </Typography>
          <FormControl fullWidth>
            <TextField
              id="outlined"
              select
              label="Seleccione una opción"
              value={selectedOption}
              onChange={handleOptionChange}
            >
              <MenuItem value={"opcion1"}>
                Introducción a la Programación
              </MenuItem>
              <MenuItem value={"opcion2"}>QA</MenuItem>
              <MenuItem value={"opcion3"}>Diseño de Software</MenuItem>
            </TextField>
          </FormControl>
          <br />
        </div>
      </Box>
    </div>
  );
}

export default StartCamera;
