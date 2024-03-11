import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import "../styles/styleViewListAssist.css"; // Importar el archivo CSS con los estilos

function ViewListAssist() {
  // Definir una lista de alumnos (aquí puedes obtenerla de tu base de datos o de otro origen de datos)
  const [students, setStudents] = useState([
    { id: 1, name: "Juan Pérez", present: true, late: false },
    { id: 2, name: "María López", present: false, late: true },
    { id: 3, name: "Carlos Gómez", present: false, late: false },
    // Agrega más alumnos según sea necesario
  ]);

  // Función para manejar el cambio en el estado de asistencia del alumno
  const handlePresenceChange = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  // Función para manejar el cambio en el estado de tardía del alumno
  const handleLateChange = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, late: !student.late } : student
      )
    );
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre del Alumno</TableCell>
            <TableCell>Presente</TableCell>
            <TableCell>Tardía</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>
                <Checkbox
                  checked={student.present}
                  onChange={() => handlePresenceChange(student.id)}
                  classes={{
                    root: "checkbox-root",
                    input: "checkbox-input",
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </TableCell>
              <TableCell>
                <Checkbox
                  checked={student.late}
                  onChange={() => handleLateChange(student.id)}
                  classes={{
                    root: "checkbox-root",
                    input: "checkbox-input",
                  }}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ViewListAssist;
