import { Box, Button, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import PeriodoController from "../serviceApi/PeriodoController";

const ModalPeriod = ({ isEdit, period, handleClose }) => {
  const { dataUser, token } = useContext(AuthContext);
  const [periodData, setPeriodData] = useState({
    id: isEdit ? period.id : "",
    nombre: isEdit ? period.nombre : "",
    fechaInicio: isEdit ? formatDate(period.fechaInicio) : "",
    fechaFin: isEdit ? formatDate(period.fechaFin) : "",
    idOrganizacion: parseInt(dataUser.IdOrganizacion),
  });

  function formatDate(date) {
    const d = new Date(date);
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const day = `${d.getDate()}`.padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPeriodData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    try {
      await PeriodoController.InsertPeriod(periodData, token);
      handleClose();
    } catch (error) {
      console.error("Error al insertar el periodo:", error);
    }
  };

  const handleEdit = async () => {
    try {
      await PeriodoController.UpdatePeriod(periodData, token);
      handleClose();
    } catch (error) {
      console.error("Error al modificar el periodo:", error);
    }
  };

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Editar un periodo" : "Agregar un periodo"}</h2>

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
            id="outlined-nombre"
            label="Nombre"
            name="nombre"
            value={periodData.nombre}
            onChange={handleChange}
          />
          <TextField
            id="outlined-fechaInicio"
            label="Fecha Inicio"
            name="fechaInicio"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={periodData.fechaInicio}
            onChange={handleChange}
          />
          <TextField
            id="outlined-fechaFin"
            label="Fecha Fin"
            name="fechaFin"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={periodData.fechaFin}
            onChange={handleChange}
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

export default ModalPeriod;
