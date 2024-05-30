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
import Header from "./Header";
import ModalCurso from "../modals/ModalCurso";
import ModalAsignarProfesor from "../modals/ModalAsignarProfesor";
import ModalAssignStudents from "../modals/ModalAssignStudents"; // Importar el nuevo modal
import CursoController from "../serviceApi/CursoController";
import EdicionCursoController from "../serviceApi/EdicionCursoController";
import UsuarioController from "../serviceApi/UsuarioController";
import { AuthContext } from "../contexts/AuthContext";

const CursoTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAssignProfessor, setOpenAssignProfessor] = useState(false);
  const [openAssignStudents, setOpenAssignStudents] = useState(false); // Estado para el nuevo modal
  const [ClassEdit, setClassEdit] = useState();
  const [Cursos, setCursos] = useState([]);
  const { dataUser, token } = useContext(AuthContext);

  const dialogRef = React.useRef(null);

  const fetchCursos = useCallback(async () => {
    try {
      const fetchedCursos = await CursoController.GetCursos(
        dataUser.IdOrganizacion,
        token
      );

      const admins = await UsuarioController.getUsers(2, token); // Asumiendo que el rol de administrador es 2

      const cursosConEdiciones = await Promise.all(
        fetchedCursos.map(async (curso) => {
          const edicionCurso = await EdicionCursoController.GetEdicionCurso(
            curso.id,
            token
          ).catch(() => []); // Asegura que `edicionCurso` sea un arreglo vacío si falla

          const admin =
            edicionCurso.length > 0
              ? admins.find(
                  (admin) => admin.id_Persona === edicionCurso[0].idPersona
                )
              : null;

          return {
            ...curso,
            edicionCurso: edicionCurso.length > 0 ? edicionCurso[0] : null,
            nombreAdmin: admin
              ? `${admin.primer_Nombre} ${admin.segundo_Nombre} ${admin.primer_Apellido} ${admin.segundo_Apellido}`
              : "N/A",
          };
        })
      );

      setCursos(cursosConEdiciones);
    } catch (error) {
      console.error("Error fetching cursos:", error);
    }
  }, [dataUser.IdOrganizacion, token]);

  useEffect(() => {
    fetchCursos();
  }, [fetchCursos]);

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchCursos(); // Refresh cursos after adding
  };

  const handleOpenEdit = (Class) => {
    setClassEdit(Class);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    fetchCursos(); // Refresh cursos after editing
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
      fetchCursos(); // Refresh cursos after deleting
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
    setClassEdit(curso); // Guarda los datos del curso en el estado
    setOpenAssignProfessor(true); // Abre el modal para asignar profesor
  };

  const handleCloseAssignProfessor = () => {
    setOpenAssignProfessor(false);
  };

  const handleAssignStudents = (curso) => {
    setClassEdit(curso); // Guarda los datos del curso en el estado
    setOpenAssignStudents(true); // Abre el modal para asignar alumnos
  };

  const handleCloseAssignStudents = () => {
    setOpenAssignStudents(false);
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>Cursos</h2>
        <div style={{ width: "80rem" }}>
          <Tooltip title="Agregar" placement="top">
            <IconButton onClick={handleOpenAdd} aria-label="add">
              <AddCircleIcon fontSize="large" color="primary" />
            </IconButton>
          </Tooltip>
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
                ? Cursos.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : Cursos
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
                    {curso.edicionCurso
                      ? curso.edicionCurso.nombreGrupo
                      : "N/A"}
                  </TableCell>
                  <TableCell align="left">
                    {curso.nombreAdmin ? curso.nombreAdmin : "N/A"}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <div className="action-btn">
                      <Tooltip
                        title={
                          curso.edicionCurso && curso.edicionCurso.idUsuario
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
          count={Cursos.length}
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
              idEdicionCurso={ClassEdit?.edicionCurso?.id || null}
              handleClose={handleCloseAssignStudents}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default CursoTable;
