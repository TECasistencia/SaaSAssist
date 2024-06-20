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
  Checkbox,
  Paper,
  TableContainer,
  TablePagination,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AlumnoController from "../serviceApi/AlumnoController";
import InscripcionController from "../serviceApi/InscripcionController";
import { AuthContext } from "../contexts/AuthContext";

const ModalAssignStudents = ({ idEdicionCurso, handleClose }) => {
  const { dataUser, token } = useContext(AuthContext);
  const [alumnos, setAlumnos] = useState([]);
  const [selectedAlumnos, setSelectedAlumnos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [alumnoToDeselect, setAlumnoToDeselect] = useState(null);

  const fetchAlumnos = useCallback(async () => {
    try {
      const fetchedAlumnos = await AlumnoController.GetAlumnos(
        dataUser.IdOrganizacion,
        token
      );
      setAlumnos(fetchedAlumnos);

      const fetchedInscripciones =
        await InscripcionController.SearchInscripcion(idEdicionCurso, token);

      const inscripcionAlumnos = fetchedInscripciones.map((inscripcion) => ({
        id: inscripcion.idAlumno,
        initiallySelected: true,
      }));

      setSelectedAlumnos(inscripcionAlumnos);
    } catch (error) {
      console.error("Error fetching alumnos:", error);
    }
  }, [dataUser.IdOrganizacion, idEdicionCurso, token]);

  useEffect(() => {
    fetchAlumnos();
  }, [fetchAlumnos]);

  const handleToggleAlumno = async (alumnoId) => {
    const isSelected = selectedAlumnos.some(
      (alumno) => alumno.id === alumnoId && alumno.initiallySelected
    );

    if (isSelected) {
      setAlumnoToDeselect(alumnoId);
      setConfirmDialogOpen(true);
    } else {
      setSelectedAlumnos((prevSelected) => {
        const exists = prevSelected.some((alumno) => alumno.id === alumnoId);
        if (exists) {
          return prevSelected.filter((alumno) => alumno.id !== alumnoId);
        }
        return [...prevSelected, { id: alumnoId, initiallySelected: false }];
      });
    }
  };

  const handleConfirmDeselect = async () => {
    try {
      const inscripcion = (
        await InscripcionController.SearchInscripcion(idEdicionCurso, token)
      ).find((inscripcion) => inscripcion.idAlumno === alumnoToDeselect);

      if (inscripcion) {
        const responseDelete = await InscripcionController.DeleteInscripcion(inscripcion.id, token);
      }
      setSelectedAlumnos((prevSelected) =>
        prevSelected.filter((alumno) => alumno.id !== alumnoToDeselect)
      );
      setAlumnoToDeselect(null);
      setConfirmDialogOpen(false);
    } catch (error) {
      console.error("Error al eliminar la inscripción:", error);
      setErrorMessage("Error al eliminar la inscripción.");
      setErrorDialogOpen(true);
    }
  };

  const handleSave = async () => {
    const alumnosYaRegistrados = selectedAlumnos.filter(
      (alumno) => alumno.initiallySelected
    );
    const nuevosAlumnos = selectedAlumnos.filter(
      (alumno) => !alumno.initiallySelected
    );

    if (alumnosYaRegistrados.length > 0 && nuevosAlumnos.length === 0) {
      setErrorMessage(
        "Todos los alumnos que está intentando asignar ya están registrados."
      );
      setErrorDialogOpen(true);
      return;
    }

    const fechaInscripcion = new Date().toISOString().split("T")[0]; // Obtener la fecha actual en formato "YYYY-MM-DD"

    try {
      const inscripciones = nuevosAlumnos.map((alumno) => ({
        id_Edicion_Curso: idEdicionCurso,
        id_Alumno: alumno.id,
        fecha_Inscripcion: fechaInscripcion,
        estado: true,
      }));

      await InscripcionController.InsertMultipleInscripciones(
        inscripciones,
        token
      );
      handleClose();
    } catch (error) {
      console.error("Error al asignar los alumnos:", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredAlumnos = alumnos.filter((alumno) => {
    const fullName = `${alumno.primer_Nombre} ${alumno.segundo_Nombre || ""} ${
      alumno.primer_Apellido
    } ${alumno.segundo_Apellido}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const isAlumnoSelected = (alumnoId) =>
    selectedAlumnos.some((alumno) => alumno.id === alumnoId);

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  const handleConfirmDialogClose = () => {
    setConfirmDialogOpen(false);
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ textAlign: "center" }}>
        Asignar Alumnos al Curso
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
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Nombre Completo</TableCell>
                  <TableCell align="center">Seleccionar</TableCell>
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
                      <TableCell align="center">
                        <Checkbox
                          checked={isAlumnoSelected(alumno.id)}
                          onChange={() => handleToggleAlumno(alumno.id)}
                        />
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
            <Button sx={{ mt: 2, mr: 1 }} onClick={handleSave}>
              Asignar Alumnos
            </Button>
            <Button sx={{ mt: 2 }} color="error" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </Box>
      </DialogContent>
      <Dialog open={errorDialogOpen} onClose={handleErrorDialogClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Box>{errorMessage}</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleErrorDialogClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={confirmDialogOpen} onClose={handleConfirmDialogClose}>
        <DialogTitle>Confirmación</DialogTitle>
        <DialogContent>
          <Box>¿Estás seguro que quieres quitar este alumno de la lista?</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmDialogClose} color="error">
            Cancelar
          </Button>
          <Button onClick={handleConfirmDeselect} color="success">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ModalAssignStudents;
