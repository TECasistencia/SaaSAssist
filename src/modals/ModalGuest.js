import { Box, Button, TextField } from "@mui/material";
import React, { useState } from "react";

const ModalGuest = ({ isEdit, guest, handleClose }) => {
  const [id, setid] = useState(isEdit ? guest.id : "");
  const [Name, setName] = useState(isEdit ? guest.name : "");
  const [LastName, setLastName] = useState(isEdit ? guest.lastName : "");
  const [Mail, setMail] = useState(isEdit ? guest.mail : "");
  const [Pass, setPass] = useState(isEdit ? guest.pass : "");

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
  const handleChangePass = (e) => {
    const inputValue = e.target.value;
    setPass(inputValue);
  };

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Editar invitado" : "Agregar un invitado"}</h2>

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
            label="Contraseña"
            value={Pass}
            onChange={handleChangePass}
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

export default ModalGuest;
