import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  IconButton,
  TablePagination,
  TableContainer,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useContext, useCallback } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import Header from "./Header";
import Footer from "./Footer";
import ModalCurso from "../modals/ModalCurso";
import ModalAsignarProfesor from "../modals/ModalAsignarProfesor";
import ModalAssignStudents from "../modals/ModalAssignStudents";
import ModalAssignVideoStudent from "../modals/ModalAssignVideoStudent";
import CursoController from "../serviceApi/CursoController";
import EdicionCursoController from "../serviceApi/EdicionCursoController";
import InscripcionController from "../serviceApi/InscripcionController";
import UsuarioController from "../serviceApi/UsuarioController";
import AlumnoController from "../serviceApi/AlumnoController";
import { AuthContext } from "../contexts/AuthContext";
import ImagenReferenciaController from "../serviceApi/ImagenReferenciaController";
import FaceRecognitionController from "../serviceApi/FaceRecognitionController";

const CursoTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAssignProfessor, setOpenAssignProfessor] = useState(false);
  const [openAssignStudents, setOpenAssignStudents] = useState(false);
  const [openAssignVideoStudents, setOpenAssignVideoStudents] = useState(false);
  const [ClassEdit, setClassEdit] = useState(null);
  const [Cursos, setCursos] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [errors, setErrors] = useState([]); // Estado para almacenar el error
  const { dataUser, token, isAdmin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openLoadingDialog, setOpenLoadingDialog] = useState(false);

  const dialogRef = React.useRef(null);
  const fetchCursos = useCallback(async () => {
    try {
      const fetchedCursos = await CursoController.GetCursos(
        dataUser.IdOrganizacion,
        token
      );

      const admins = await UsuarioController.getUsers(2, token);

      const cursosConEdiciones = await Promise.all(
        fetchedCursos.map(async (curso) => {
          let edicionCurso = [];
          let admin = null;
          let inscripciones = [];
          let imagenes = [];
          let check = false;

          try {
            edicionCurso = await EdicionCursoController.GetEdicionCurso(
              curso.id,
              token
            );

            if (edicionCurso.length > 0) {
              admin = admins.find(
                (admin) => admin.id === edicionCurso[0].idPersona
              );

              inscripciones = await InscripcionController.SearchInscripcion(
                edicionCurso[0].id,
                token
              );

              try {
                imagenes =
                  await ImagenReferenciaController.BuscarImagenesReferenciaPorCurso(
                    curso.id,
                    token
                  );
              } catch (error) {
                setErrors((prevErrors) => [
                  ...prevErrors,
                  `Fallo al obtener las imágenes del curso ${curso.id}:`,
                  error,
                ]);
              }

              const idsAlumnos = inscripciones.map(
                (inscripcion) => inscripcion.idAlumno
              );
              const idsConVideo = imagenes.map((imagen) => imagen.iD_Alumno);
              check = idsAlumnos.every((id) => idsConVideo.includes(id));
            }
          } catch (error) {
            setErrors((prevErrors) => [
              ...prevErrors,
              `Fallo en curso ${curso.id} ${error.message}`,
            ]);
          }

          return {
            ...curso,
            edicionCursos:
              edicionCurso.length > 0
                ? { ...edicionCurso[0], inscripcions: inscripciones }
                : null,
            nombreAdmin: admin
              ? `${admin.primer_Nombre} ${admin.segundo_Nombre || ""} ${
                  admin.primer_Apellido
                } ${admin.segundo_Apellido || ""}`
              : "N/A",
            imagenesReferencia: imagenes,
            check,
          };
        })
      );

      setCursos(cursosConEdiciones);
    } catch (error) {
      setErrors((prevErrors) => [
        ...prevErrors,
        `Error obteniendo cursos: ${error.message}`,
      ]);
    }
  }, [dataUser.IdOrganizacion, token]);

  useEffect(() => {
    const fetchData = async () => {
      setErrors([]); // Limpiar errores al comenzar la carga de datos
      await fetchCursos();
    };
    fetchData();
  }, [fetchCursos]);

  useEffect(() => {
    const filtered = isAdmin
      ? Cursos.filter(
          (curso) =>
            curso.edicionCursos &&
            curso.edicionCursos.idPersona === parseInt(dataUser.IdPersona)
        )
      : Cursos;

    setFilteredCursos(filtered);
  }, [isAdmin, dataUser.IdPersona, Cursos]);

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchCursos();
  };

  const handleOpenEdit = (Class) => {
    setClassEdit(Class);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    fetchCursos();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClickOpenDelete = (Class) => {
    setClassEdit(Class);
    setOpenDelete(true);
  };

  const handleCloseDelete = async () => {
    await fetchCursos();
    setOpenDelete(false);
  };

  const handleDelete = async (id) => {
    try {
      await CursoController.DeleteCurso(id, token);
      setOpenDelete(false);
      fetchCursos();
    } catch (error) {
      setErrors((prevErrors) => [
        ...prevErrors,
        "Fallo al eliminar un curso:",
        error,
      ]);
    }
  };

  const handleEntering = () => {
    if (dialogRef.current != null) {
      dialogRef.current.focus();
    }
  };

  const handleAssignProfessor = (curso) => {
    setClassEdit(curso);
    setOpenAssignProfessor(true);
  };

  const handleCloseAssignProfessor = () => {
    setOpenAssignProfessor(false);
    fetchCursos();
  };

  const handleAssignStudents = (curso) => {
    setClassEdit(curso);
    setOpenAssignStudents(true);
  };

  const handleCloseAssignStudents = () => {
    setOpenAssignStudents(false);
    fetchCursos();
  };

  const handleAssignVideoStudents = (curso) => {
    setClassEdit(curso);
    setOpenAssignVideoStudents(true);
  };

  const handleCloseAssignVideoStudents = () => {
    setOpenAssignVideoStudents(false);
    fetchCursos();
  };

  const handleCloseLoadingDialog = () => {
    setOpenLoadingDialog(false);
  };

  const handleEntrenar = async (curso) => {
    const alumnoImagenMap = {};

    try {
      const fetchedAlumnos = await AlumnoController.GetAlumnos(
        parseInt(dataUser.IdOrganizacion),
        token
      );

      curso.edicionCursos.inscripcions.forEach((inscripcion) => {
        const idAlumno = inscripcion.idAlumno;
        const idInscripcion = inscripcion.id;
        const imagenReferencia = curso.imagenesReferencia.find(
          (imagen) => imagen.iD_Alumno === idAlumno
        );

        const alumno = fetchedAlumnos.find((alumno) => alumno.id === idAlumno);
        console.log();
        if (imagenReferencia && alumno) {
          const nombreCompleto = `${alumno.primer_Nombre} ${
            alumno.segundo_Nombre || ""
          } ${alumno.primer_Apellido} ${alumno.segundo_Apellido}`.toLowerCase();
          alumnoImagenMap[nombreCompleto + "_" + idInscripcion] =
          imagenReferencia.ruta_Archivo;
        }
      });
      
      const cursoData = {
        idCurso: String(curso.id),
        videos_alumnos: alumnoImagenMap,
      };
      
      handleDownloadAndGenerate(cursoData);
    } catch (error) {
      console.error("Error fetching alumnos:", error);
    }
  };

  const handleDownloadAndGenerate = async (data) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setOpenLoadingDialog(true);

    try {
      const response = await FaceRecognitionController.RunDownloadAndGenerate(
        data, token
      );
      if (response.result === "") {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al generar los datos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Header />
      <Box
        sx={{
          flex: "1",
          overflow: "auto",
        }}
      >
        <div className="container">
          <h2>Cursos</h2>
          <div style={{ width: "80rem" }}>
            {!isAdmin && (
              <Tooltip title="Agregar" placement="top">
                <IconButton onClick={handleOpenAdd} aria-label="add">
                  <AddCircleIcon fontSize="large" color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <TableContainer sx={{ width: "80rem" }} component={Paper}>
            <Table sx={{ width: "80rem" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="left">Nombre</TableCell>
                  <TableCell align="left">Código del Curso</TableCell>
                  <TableCell align="left">Nombre Edición</TableCell>
                  <TableCell align="left">Profesor asignado</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {(rowsPerPage > 0
                  ? filteredCursos.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : filteredCursos
                ).map((curso) => (
                  <TableRow
                    key={curso.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center" component="th" scope="row">
                      {curso.id}
                    </TableCell>
                    <TableCell align="left">{curso.nombre}</TableCell>
                    <TableCell align="left">{curso.codigoCurso}</TableCell>
                    <TableCell align="left">
                      {curso.edicionCursos
                        ? curso.edicionCursos.nombreGrupo
                        : "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {curso.nombreAdmin ? curso.nombreAdmin : "N/A"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ display: "flex", justifyContent: "center" }}
                    >
                      {!isAdmin && (
                        <>
                          <div className="action-btn">
                            <Tooltip
                              title={
                                curso.edicionCursos &&
                                curso.edicionCursos.idPersona
                                  ? "Editar Profesor"
                                  : "Asignar Profesor"
                              }
                              placement="top"
                            >
                              <IconButton
                                color="primary"
                                aria-label="assign-professor"
                                onClick={() => handleAssignProfessor(curso)}
                              >
                                <PersonAddIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </>
                      )}
                      <div className="action-btn">
                        <Tooltip title="Seleccionar Alumnos" placement="top">
                          <IconButton
                            color="secondary"
                            aria-label="select-students"
                            onClick={() => handleAssignStudents(curso)}
                          >
                            <GroupAddIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div className="action-btn">
                        <Tooltip title="Asignar Videos" placement="top">
                          <IconButton
                            color="warning"
                            aria-label="assign-videos"
                            onClick={() => handleAssignVideoStudents(curso)}
                          >
                            <VideoCallIcon />
                          </IconButton>
                        </Tooltip>
                      </div>
                      <div className="action-btn">
                        <Tooltip
                          title={
                            curso.check
                              ? "Entrenar el modelo"
                              : "No todos los alumnos tienen video"
                          }
                          placement="top"
                        >
                          <span>
                            <IconButton
                              color="default"
                              aria-label="entrenar"
                              onClick={() => handleEntrenar(curso)}
                              disabled={!curso.check}
                            >
                              <FitnessCenterIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </div>
                      {!isAdmin && (
                        <>
                          <div className="action-btn">
                            <Tooltip title="Eliminar" placement="top">
                              <IconButton
                                color="error"
                                aria-label="delete"
                                onClick={() => handleClickOpenDelete(curso)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                          <div className="action-btn">
                            <Tooltip title="Editar" placement="top">
                              <IconButton
                                color="success"
                                aria-label="edit"
                                onClick={() => handleOpenEdit(curso)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </div>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            sx={{ width: "80rem" }}
            component="div"
            rowsPerPageOptions={[5, 10, 25]}
            count={filteredCursos.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Dialog
            TransitionProps={{ onEntering: handleEntering }}
            open={openAdd}
          >
            <DialogContent>
              <ModalCurso
                isEdit={false}
                data={null}
                handleClose={handleCloseAdd}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            TransitionProps={{ onEntering: handleEntering }}
            open={openEdit}
          >
            <DialogContent>
              <ModalCurso
                isEdit={true}
                data={ClassEdit}
                handleClose={handleCloseEdit}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            open={openDelete}
            onClose={handleCloseDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"¿Está seguro que desea eliminar el curso?"}
            </DialogTitle>
            <DialogActions>
              <Button
                color="success"
                onClick={() => handleDelete(ClassEdit.id)}
              >
                Aceptar
              </Button>
              <Button color="error" onClick={handleCloseDelete} autoFocus>
                Cancelar
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            TransitionProps={{ onEntering: handleEntering }}
            open={openAssignProfessor}
          >
            <DialogContent>
              <ModalAsignarProfesor
                curso={ClassEdit}
                handleClose={handleCloseAssignProfessor}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            TransitionProps={{ onEntering: handleEntering }}
            open={openAssignStudents}
          >
            <DialogContent>
              <ModalAssignStudents
                id={ClassEdit?.id || null}
                idEdicionCurso={ClassEdit?.edicionCursos?.id || null}
                handleClose={handleCloseAssignStudents}
              />
            </DialogContent>
          </Dialog>

          <Dialog
            TransitionProps={{ onEntering: handleEntering }}
            open={openAssignVideoStudents}
          >
            <DialogContent>
              {ClassEdit && ClassEdit.edicionCursos ? (
                <ModalAssignVideoStudent
                  id={ClassEdit.id}
                  idEdicionCurso={ClassEdit.edicionCursos.id}
                  handleClose={handleCloseAssignVideoStudents}
                />
              ) : null}
            </DialogContent>
          </Dialog>
          <Dialog open={openLoadingDialog} onClose={handleCloseLoadingDialog}>
            <DialogTitle>
              {loading
                ? "Procesando... esta acción puede tardar varios minutos"
                : error
                ? "Error"
                : "Éxito"}
            </DialogTitle>
            <DialogContent>
              {loading ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress />
                </div>
              ) : (
                <Typography>
                  {error
                    ? `Error: ${error}`
                    : "El proceso se completó exitosamente."}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              {!loading && (
                <Button onClick={handleCloseLoadingDialog} color="primary">
                  Cerrar
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </div>
      </Box>
      <Footer />
    </Box>
  );
};

export default CursoTable;
