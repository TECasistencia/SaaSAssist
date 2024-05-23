import { Box, Button, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import EspacioController from "../serviceApi/EspacioController";

const ModalSpace = ({ isEdit, space, handleClose }) => {
  const { dataUser, token } = useContext(AuthContext);
  const [spaceData, setSpaceData] = useState({
    id: isEdit ? space.id : "",
    name: isEdit ? space.nombre : "",
    capacity: isEdit ? space.capacidad : "",
    idOrganizacion: parseInt(dataUser.IdOrganizacion),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpaceData((prevState) => ({
      ...prevState,
      [name]: name === "capacity" ? parseInt(value, 10) : value,
    }));
  };

  const handleAdd = async () => {
    try {
      await EspacioController.InsertSpace(spaceData, token);
      handleClose();
    } catch (error) {
      console.error("Error al insertar el espacio:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await EspacioController.UpdateSpace(spaceData, token);
      handleClose();
    } catch (error) {
      console.error("Error al modificar el espacio:", error);
    }
  };

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Editar un espacio" : "Agregar un espacio"}</h2>

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
            id="outlined-name"
            label="Nombre"
            name="name"
            value={spaceData.name}
            onChange={handleChange}
          />
          <TextField
            id="outlined-capacity"
            label="Capacidad"
            name="capacity"
            value={spaceData.capacity}
            onChange={handleChange}
            type="number"
          />

          <br />
          <div className="button-container">
            <Button sx={{ mt: 2 }} onClick={isEdit ? handleEdit : handleAdd}>
              {isEdit ? "Editar" : "Crear"}
            </Button>

            <Button sx={{ mt: 2 }} color="error" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ModalSpace;
