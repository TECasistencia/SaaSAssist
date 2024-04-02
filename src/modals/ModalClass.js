import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";

const ModalClass = ({ isEdit, data, handleClose }) => {
  const [id, setid] = useState(isEdit ? data.id : "");
  const [Name, setName] = useState(isEdit ? data.name : "");
  const [Available, setAvailable] = useState(isEdit ? data.available : "");

  const handleChangeId = (e) => {
    const inputValue = e.target.value;
    setid(inputValue);
  };

  const handleChangeName = (e) => {
    const inputValue = e.target.value;
    setName(inputValue);
  };

  const handleChangeAvailable = (e) => {
    const inputValue = e.target.value;
    setAvailable(inputValue);
  };

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Editar una clase" : "Agregar una clase"}</h2>

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
            label="Disponibilidad"
            value={Available}
            onChange={handleChangeAvailable}
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

export default ModalClass;
