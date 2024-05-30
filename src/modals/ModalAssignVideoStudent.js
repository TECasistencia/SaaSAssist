import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  TablePagination,
  Toolbar,
  Typography,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AlumnoController from "../serviceApi/AlumnoController";
import InscripcionController from "../serviceApi/InscripcionController";
import { AuthContext } from "../contexts/AuthContext";

const ModalAssignVideoStudent = ({ idEdicionCurso, handleClose }) => {
  const { dataUser, token } = useContext(AuthContext);
  const [alumnos, setAlumnos] = useState([]);
  const [inscritos, setInscritos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchAlumnos = useCallback(async () => {
    try {
      const fetchedAlumnos = await AlumnoController.GetAlumnos(
        dataUser.IdOrganizacion,
        token
      );
      const fetchedInscritos = await InscripcionController.SearchInscripcion(
        idEdicionCurso,
        token
      );
      setAlumnos(fetchedAlumnos);
      setInscritos(fetchedInscritos);
      filterInscritos(fetchedAlumnos, fetchedInscritos);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dataUser.IdOrganizacion, idEdicionCurso, token]);

  useEffect(() => {
    fetchAlumnos();
  }, [fetchAlumnos]);

  const filterInscritos = (alumnos, inscritos) => {
    const filtered = alumnos.filter((alumno) =>
      inscritos.some((inscripcion) => inscripcion.idAlumno === alumno.id)
    );
    setFilteredAlumnos(filtered);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    const query = event.target.value.toLowerCase();
    const filtered = alumnos.filter((alumno) => {
      const fullName = `${alumno.primer_Nombre} ${
        alumno.segundo_Nombre || ""
      } ${alumno.primer_Apellido} ${alumno.segundo_Apellido}`.toLowerCase();
      return fullName.includes(query);
    });
    setFilteredAlumnos(filtered);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  console.log(filteredAlumnos);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ textAlign: "center" }}>
        Alumnos Inscritos al Curso
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            "& .MuiTextField-root": { m: 1, width: "20rem" },
            "& .MuiTableContainer-root": {
              m: 1,
              maxHeight: "30rem",
              width: "100%",
            },
          }}
          noValidate
          autoComplete="off"
        >
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Toolbar sx={{ justifyContent: "center" }}>
              <Typography variant="h6" id="tableTitle" component="div">
                Alumnos
              </Typography>
            </Toolbar>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Buscar Alumno"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2, width: "80%", alignSelf: "center" }}
            />
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre Completo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAlumnos
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((alumno) => (
                    <TableRow key={alumno.id}>
                      <TableCell>
                        {`${alumno.primer_Nombre} ${
                          alumno.segundo_Nombre || ""
                        } ${alumno.primer_Apellido} ${alumno.segundo_Apellido}`}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredAlumnos.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
          <div
            className="button-container"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Button sx={{ mt: 2, mr: 1 }} onClick={handleClose}>
              Cerrar
            </Button>
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAssignVideoStudent;
