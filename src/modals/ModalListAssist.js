import React, { useState, useEffect, useContext, useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import { AuthContext } from "../contexts/AuthContext"; // Importa AuthContext
import AlumnoController from "../serviceApi/AlumnoController"; // Importa AlumnoController

function ViewListAssist({ alumnos }) {
  const { dataUser, token } = useContext(AuthContext); // Obtiene dataUser y token del contexto
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Puedes ajustar el número de filas por página

  const fetchAlumnos = useCallback(async () => {
    try {
      const fetchedAlumnos = await AlumnoController.GetAlumnos(
        dataUser.IdOrganizacion,
        token
      );

      const initialStudents = alumnos.map((alumno, index) => {
        const match = fetchedAlumnos.find(
          (fetchedAlumno) => fetchedAlumno.id === alumno.idAlumno
        );
        return {
          id: index + 1,
          name: match
            ? `${match.primer_Nombre} ${
                match.segundo_Nombre ? match.segundo_Nombre + " " : ""
              }${match.primer_Apellido} ${match.segundo_Apellido}`
            : "Unknown",
          present: false,
        };
      });

      setStudents(initialStudents);
    } catch (error) {
      console.error("Error fetching alumnos:", error);
    }
  }, [dataUser.IdOrganizacion, token, alumnos]);

  useEffect(() => {
    fetchAlumnos();
  }, [fetchAlumnos]);

  const handlePresenceChange = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Nombre del Alumno</TableCell>
            <TableCell align="left">Presente</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((student) => (
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
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={students.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

export default ViewListAssist;
