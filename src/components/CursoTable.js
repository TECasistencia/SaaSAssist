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
import ModalCurso from "../modals/ModalCurso";
import ModalAsignarProfesor from "../modals/ModalAsignarProfesor";
import ModalAssignStudents from "../modals/ModalAssignStudents";
import ModalAssignVideoStudent from "../modals/ModalAssignVideoStudent";
import CursoController from "../serviceApi/CursoController";
import EdicionCursoController from "../serviceApi/EdicionCursoController";
import InscripcionController from "../serviceApi/InscripcionController";
import UsuarioController from "../serviceApi/UsuarioController";
import AlumnoController from "../serviceApi/AlumnoController";
import ImagenReferenciaController from "../serviceApi/ImagenReferenciaController";
import { AuthContext } from "../contexts/AuthContext";

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
  const { dataUser, token, isAdmin } = useContext(AuthContext);

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
          try {
            const edicionCurso = await EdicionCursoController.GetEdicionCurso(
              curso.id,
              token
            );
            const admin =
              edicionCurso.length > 0
                ? admins.find(
                    (admin) => admin.id_Persona === edicionCurso[0].idPersona
                  )
                : null;

            const inscripciones =
              edicionCurso.length > 0
                ? await InscripcionController.SearchInscripcion(
                    edicionCurso[0].id,
                    token
                  )
                : [];

            const imagenes =
              await ImagenReferenciaController.BuscarImagenesReferenciaPorCurso(
                curso.id,
                token
              );

            const idsAlumnos = inscripciones.map(
              (inscripcion) => inscripcion.idAlumno
            );
            const idsConVideo = imagenes.map((imagen) => imagen.iD_Alumno);
            const check = idsAlumnos.every((id) => idsConVideo.includes(id));

            return {
              ...curso,
              edicionCursos:
                edicionCurso.length > 0
                  ? { ...edicionCurso[0], inscripcions: inscripciones }
                  : null,
              nombreAdmin: admin
                ? `${admin.primer_Nombre} ${admin.segundo_Nombre} ${admin.primer_Apellido} ${admin.segundo_Apellido}`
                : "N/A",
              imagenesReferencia: imagenes,
              check,
            };
          } catch (error) {
            return {
              ...curso,
              edicionCursos: null,
              nombreAdmin: "N/A",
              imagenesReferencia: [],
              check: false,
            };
          }
        })
      );

      setCursos(cursosConEdiciones);
    } catch (error) {
      console.error("Error fetching cursos:", error);
    }
  }, [dataUser.IdOrganizacion, token]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchCursos();
    };
    fetchData();
  }, [fetchCursos]);

  useEffect(() => {
    const filtered = isAdmin
      ? Cursos.filter(
          (curso) =>
            curso.edicionCursos && curso.edicionCursos.idPersona === dataUser.id
        )
      : Cursos;
    setFilteredCursos(filtered);
  }, [isAdmin, dataUser.id, Cursos]);

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

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDelete = async (id) => {
    try {
      await CursoController.DeleteCurso(id, token);
      setOpenDelete(false);
      fetchCursos();
    } catch (error) {
      console.error("Error deleting curso:", error);
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
  };

  const handleAssignStudents = (curso) => {
    setClassEdit(curso);
    setOpenAssignStudents(true);
  };

  const handleCloseAssignStudents = () => {
    setOpenAssignStudents(false);
  };

  const handleAssignVideoStudents = (curso) => {
    setClassEdit(curso);
    setOpenAssignVideoStudents(true);
  };

  const handleCloseAssignVideoStudents = () => {
    setOpenAssignVideoStudents(false);
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
        const imagenReferencia = curso.imagenesReferencia.find(
          (imagen) => imagen.iD_Alumno === idAlumno
        );

        const alumno = fetchedAlumnos.find((alumno) => alumno.id === idAlumno);

        if (imagenReferencia && alumno) {
          const nombreCompleto = `${alumno.primer_Nombre} ${
            alumno.segundo_Nombre || ""
          } ${alumno.primer_Apellido} ${alumno.segundo_Apellido}`.toLowerCase();
          alumnoImagenMap[nombreCompleto + "_" + idAlumno] =
            imagenReferencia.ruta_Archivo;
        }
      });

      const cursoData = {
        cursoId: curso.id,
        alumnos: alumnoImagenMap,
      };

      console.log("Entrenar modelo para el curso:", cursoData);
      // Aquí puedes agregar la lógica adicional necesaria para entrenar el modelo con cursoData
    } catch (error) {
      console.error("Error fetching alumnos:", error);
    }
  };

  return (
    <>
      <Header />
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
                              curso.edicionCursos.idUsuario
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
        <Dialog TransitionProps={{ onEntering: handleEntering }} open={openAdd}>
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
            {"¿Está seguro que desea eliminar la clase?"}
          </DialogTitle>
          <DialogActions>
            <Button color="success" onClick={() => handleDelete(ClassEdit.id)}>
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
      </div>
    </>
  );
};

export default CursoTable;
