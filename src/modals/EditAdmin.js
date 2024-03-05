import { Box, Button, TextField } from '@mui/material';
import React, { useState } from 'react'

const EditAdmin = ({ admin, handleClose }) => {
  const [id, setid] = useState(admin.id);
  const [Name, setName] = useState(admin.nombre);
  const [LastName, setLastName] = useState(admin.apellidos);
  const [Mail, setMail] = useState(admin.correo);
  const [Images, setImages] = useState(admin.imagenes);

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
      <h2>Editar administrador</h2>

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

export default EditAdmin
