import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";

const ModalAdmin = ({ isEdit, admin, handleClose }) => {
  const [id, setid] = useState(isEdit ? admin.id : "");
  const [Name, setName] = useState(isEdit ? admin.name : "");
  const [LastName, setLastName] = useState(isEdit ? admin.lastName : "");
  const [Mail, setMail] = useState(isEdit ? admin.mail : "");
  const [Images, setImages] = useState(isEdit ? admin.images : "");

  const handleChangeId = (e) => {
    const inputValue = e.target.value;
    setid(inputValue);
  };
  const handleChangeName = (e) => {
    const inputValue = e.target.value;
    setName(inputValue);
  };
  const handleChangeLastName = (e) => {
    const inputValue = e.target.value;
    setLastName(inputValue);
  };
  const handleChangeMail = (e) => {
    const inputValue = e.target.value;
    setMail(inputValue);
  };
  const handleChangeImages = (e) => {
    const inputValue = e.target.value;
    setImages(inputValue);
  };

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Editar administrador" : "Agregar un administrador"}</h2>

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
            disabled
          />
          <TextField
            id="outlined"
            label="Nombre"
            value={Name}
            onChange={handleChangeName}
          />
          <TextField
            id="outlined"
            label="Apellidos"
            value={LastName}
            onChange={handleChangeLastName}
          />
          <TextField
            id="outlined"
            label="Correo"
            value={Mail}
            onChange={handleChangeMail}
          />
          <TextField
            id="outlined"
            label="Imágenes"
            value={Images}
            onChange={handleChangeImages}
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

export default ModalAdmin;
