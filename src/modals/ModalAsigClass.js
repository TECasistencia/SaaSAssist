import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";

const classesList = [
  { name: "Introducción a la Programación", available: 10 },
  { name: "Estructuras de Datos", available: 5 },
  { name: "Algoritmos y Complejidad", available: 0 }, // Clase no disponible
  { name: "Bases de Datos", available: 8 },
  { name: "Ingeniería de Software", available: 3 },
];

const ModalAsigClass = ({ isEdit, user, handleClose }) => {
  const [asigClass, setAsigClass] = useState(isEdit ? user.asigClass : "");

  const handleChangeAsigClass = (e) => {
    const selectedClass = e.target.value;
    setAsigClass(selectedClass);
  };

  const availableClasses = classesList.filter((cls) => cls.available > 0);

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Asignar clase al profesor" : ""}</h2>
      {/* Tabla de Clases y Disponibilidad */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre de la Clase</TableCell>
              <TableCell>Disponibilidad</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classesList.map((cls, index) => (
              <TableRow key={index}>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.available}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        component="form"
        sx={{
          "& .MuiFormControl-root": { m: 1, width: "20rem" },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <FormControl variant="outlined">
            <InputLabel id="select-class-label">Asignar Clases</InputLabel>
            <Select
              labelId="select-class-label"
              id="select-class"
              value={asigClass}
              onChange={handleChangeAsigClass}
              label="Asignar Clases"
            >
              {availableClasses.map((cls, index) => (
                <MenuItem key={index} value={cls.name}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <br />
          <div className="button-container">
            <Button sx={{ mt: 2 }}>Confirmar</Button>
            <Button sx={{ mt: 2 }} color="error" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ModalAsigClass;
