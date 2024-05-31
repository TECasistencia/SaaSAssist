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
import ImagenReferenciaController from "../serviceApi/ImagenReferenciaController"; // Importar el controlador
import { AuthContext } from "../contexts/AuthContext";

const ModalAssignVideoStudent = ({ idEdicionCurso, handleClose }) => {
  const { dataUser, token } = useContext(AuthContext);
  const [alumnos, setAlumnos] = useState([]);
  const [inscritos, setInscritos] = useState([]);
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [urls, setUrls] = useState({});
  const [validUrls, setValidUrls] = useState({});
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

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

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUrlChange = (event, alumnoId) => {
    const { value } = event.target;
    setUrls((prevUrls) => ({
      ...prevUrls,
      [alumnoId]: value,
    }));
    setValidUrls((prevValidUrls) => ({
      ...prevValidUrls,
      [alumnoId]: false,
    }));
  };

  const getFechaCarga = () => {
    const fecha = new Date();
    return fecha.toISOString().split("T")[0];
  };

  const videoData = filteredAlumnos.map((alumno) => ({
    IdPersona: alumno.id_Persona,
    RutaArchivo: urls[alumno.id] || "",
    FechaCarga: getFechaCarga(),
    Usado: true,
  }));

  const allUrlsFilled = filteredAlumnos.every((alumno) => urls[alumno.id]);
  const allUrlsValid = filteredAlumnos.every((alumno) => validUrls[alumno.id]);

  const handleEnviar = async () => {
    try {
      await ImagenReferenciaController.InsertarImagenReferencia(
        videoData,
        token
      );
      setSuccessDialogOpen(true);
    } catch (error) {
      setErrorMessage("Error al insertar las imágenes de referencia");
      setErrorDialogOpen(true);
    }
  };

  const handleComprobarUrl = (alumnoId, url) => {
    if (url) {
      const fileId = url.match(/[-\w]{25,}/); // Extrae el ID del archivo del enlace de Google Drive
      if (fileId) {
        const directUrl = `https://drive.google.com/file/d/${fileId[0]}/preview`;
        fetch(directUrl)
          .then((response) => {
            if (response.ok) {
              window.open(directUrl, "_blank");
              setValidUrls((prevValidUrls) => ({
                ...prevValidUrls,
                [alumnoId]: true,
              }));
            } else {
              setErrorMessage(
                "El enlace de Google Drive no muestra contenido válido"
              );
              setErrorDialogOpen(true);
              setValidUrls((prevValidUrls) => ({
                ...prevValidUrls,
                [alumnoId]: false,
              }));
            }
          })
          .catch(() => {
            setErrorMessage(
              "El enlace de Google Drive no muestra contenido válido"
            );
            setErrorDialogOpen(true);
            setValidUrls((prevValidUrls) => ({
              ...prevValidUrls,
              [alumnoId]: false,
            }));
          });
      } else {
        setErrorMessage("URL de Google Drive no válido");
        setErrorDialogOpen(true);
      }
    }
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
  };

  return (
    <Dialog open={true} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle style={{ textAlign: "center" }}>
        Asignar videos a los alumnos inscritos al curso
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
                  <TableCell>URL del Video</TableCell>
                  <TableCell>Acciones</TableCell>
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
                      <TableCell>
                        <TextField
                          value={urls[alumno.id] || ""}
                          onChange={(event) =>
                            handleUrlChange(event, alumno.id)
                          }
                          placeholder="URL del video"
                          fullWidth
                          disabled={validUrls[alumno.id]} // Deshabilitar si la URL es válida
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() =>
                            handleComprobarUrl(alumno.id, urls[alumno.id] || "")
                          }
                          disabled={!urls[alumno.id]}
                        >
                          Comprobar
                        </Button>
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
            <Button
              sx={{ mt: 2, mr: 1 }}
              onClick={handleEnviar}
              disabled={!allUrlsFilled || !allUrlsValid}
            >
              Enviar
            </Button>
            <Button sx={{ mt: 2 }} color="error" onClick={handleClose}>
              Cerrar
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
      <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
        <DialogTitle>Éxito</DialogTitle>
        <DialogContent>
          <Box>Las imágenes de referencia se han insertado correctamente.</Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessDialogClose} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ModalAssignVideoStudent;
