import { Box, Button, TextField, Alert } from "@mui/material";
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
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSpaceData((prevState) => ({
      ...prevState,
      [name]: name === "capacity" ? parseInt(value, 10) : value,
    }));
  };

  const handleAdd = async () => {
    if (!spaceData.name || !spaceData.capacity) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      await EspacioController.InsertSpace(spaceData, token);
      handleClose();
    } catch (error) {
      console.error("Error al insertar el espacio:", error);
      setError("Error al insertar el espacio. Intente nuevamente.");
    }
  };

  const handleEdit = async () => {
    if (!spaceData.name || !spaceData.capacity) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      await EspacioController.UpdateSpace(spaceData, token);
      handleClose();
    } catch (error) {
      console.error("Error al modificar el espacio:", error);
      setError("Error al modificar el espacio. Intente nuevamente.");
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

          {error && (
            <Alert
              severity="error"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                mt: 2,
              }}
            >
              {error}
            </Alert>
          )}

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
