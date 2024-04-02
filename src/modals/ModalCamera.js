import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";

const ModalCamera = ({ isEdit, camera, handleClose }) => {
  const [id, setid] = useState(isEdit ? camera.id : "");
  const [Name, setName] = useState(isEdit ? camera.name : "");
  const [Area, setArea] = useState(isEdit ? camera.area : "");

  const handleChangeId = (e) => {
    const inputValue = e.target.value;
    setid(inputValue);
  };

  const handleChangeName = (e) => {
    const inputValue = e.target.value;
    setName(inputValue);
  };

  const handleChangArea = (e) => {
    const inputValue = e.target.value;
    setArea(inputValue);
  };

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Editar una camara" : "Agregar una camara"}</h2>

      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "20rem" },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="outlined"
            label="ID"
            value={id}
            onChange={handleChangeId}
            disabled={isEdit}
          />
          <TextField
            id="outlined"
            label="Nombre"
            value={Name}
            onChange={handleChangeName}
          />
          <TextField
            id="outlined"
            label="Area"
            value={Area}
            onChange={handleChangArea}
          />

          <br />
          <div className="button-container">
            <Button sx={{ mt: 2 }}>Editar</Button>
            <Button sx={{ mt: 2 }} color="error" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ModalCamera;
