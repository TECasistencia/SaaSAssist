import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";

const ModalUser = ({ isEdit, user, handleClose }) => {
  const [id, setid] = useState(isEdit ? user.id : "");
  const [Name, setName] = useState(isEdit ? user.name : "");
  const [LastName, setLastName] = useState(isEdit ? user.lastName : "");
  const [Mail, setMail] = useState(isEdit ? user.mail : "");
  const [Images, setImages] = useState(isEdit ? user.images : "");
  const [IdGuest, setIdGuest] = useState(isEdit ? user.idGuest : "");

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
  const handleChangeIdGuest = (e) => {
    const inputValue = e.target.value;
    setIdGuest(inputValue);
  };

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Editar usuario" : "Agregar un usuario"}</h2>

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
          <TextField
            id="outlined"
            label="id invitado (Padre)"
            value={IdGuest}
            onChange={handleChangeIdGuest}
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

export default ModalUser;
