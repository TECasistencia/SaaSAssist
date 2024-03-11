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
    <TableContainer sx={{ width: "35rem" }} component={Paper}>
      <Table sx={{ width: "35rem" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nombre del Alumno</TableCell>
            <TableCell align="left">Presente</TableCell>
            <TableCell align="right">Tardía</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow
              key={student.id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {student.name}
              </TableCell>
              <TableCell align="left">
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
              <TableCell align="right">
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
