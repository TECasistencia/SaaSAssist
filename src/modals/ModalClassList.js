import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField, // Importar el componente TextField de MUI para el buscador
} from "@mui/material";
import React, { useState } from "react";

const ModalClassList = ({ data, handleClose }) => {
  const alumnosList = [
    { firstName: "Juan", lastName: "Perez" },
    { firstName: "Maria", lastName: "Gonzalez" },
    { firstName: "Pedro", lastName: "Rodriguez" },
    { firstName: "Ana", lastName: "Martinez" },
    { firstName: "Juan", lastName: "Lopez" },
  ];

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para almacenar el término de búsqueda

  const handleCheckboxChange = (index) => {
    const newSelectedStudents = [...selectedStudents];
    if (newSelectedStudents.includes(index)) {
      newSelectedStudents.splice(newSelectedStudents.indexOf(index), 1);
    } else {
      newSelectedStudents.push(index);
    }
    setSelectedStudents(newSelectedStudents);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Actualizar el término de búsqueda cuando cambia el valor del campo de texto
  };

  // Filtrar la lista de alumnos en función del término de búsqueda
  const filteredStudents = alumnosList.filter((student) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="container-modal">
      <h2>Asignar alumnos a {data.name}</h2>
      {/* Agregar el campo de texto para el buscador */}
      <TextField
        label="Buscar alumno"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearch}
        sx={{ mb: 2 }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Nombre</TableCell>
              <TableCell align="left">Apellidos</TableCell>
              <TableCell align="right">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student, index) => (
              <TableRow key={index}>
                <TableCell align="left">{student.firstName}</TableCell>
                <TableCell align="left">{student.lastName}</TableCell>
                <TableCell align="right">
                  <Checkbox
                    checked={selectedStudents.includes(index)}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </TableCell>
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

export default ModalClassList;
