import React, { useState, useEffect, useCallback, useContext } from "react";
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
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "./Header";
import ModalStudent from "../modals/ModalStudent";
import AlumnoController from "../serviceApi/AlumnoController";
import { AuthContext } from "../contexts/AuthContext";
import Footer from "./Footer";

const StudentTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [studentEdit, setStudentEdit] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const { dataUser, token } = useContext(AuthContext);
  const dialogRef = React.useRef(null);

  const fetchStudents = useCallback(async () => {
    try {
      const fetchedStudents = await AlumnoController.GetAlumnos(
        parseInt(dataUser.IdOrganizacion),
        token
      );
      setStudents(fetchedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  }, [dataUser, token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchStudents();
  };

  const handleOpenEdit = (student) => {
    setStudentEdit(student);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    fetchStudents();
  };

  const handleClickOpenDelete = (student) => {
    setStudentToDelete(student);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      await AlumnoController.DeleteAlumno(studentToDelete.id, token);
      handleCloseDelete();
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEntering = () => {
    if (dialogRef.current != null) {
      dialogRef.current.focus();
    }
  };

  const getFullName = (student) => {
    const { primer_Nombre, segundo_Nombre, primer_Apellido, segundo_Apellido } =
      student;
    return `${primer_Nombre} ${
      segundo_Nombre ? segundo_Nombre + " " : ""
    }${primer_Apellido} ${segundo_Apellido}`;
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>Alumnos</h2>
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
                <TableCell>ID</TableCell>
                <TableCell align="left">Nombre</TableCell>
                <TableCell align="left">Fecha Ingreso</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? students.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : students
              ).map((student) => (
                <TableRow
                  key={student.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {student.id}
                  </TableCell>
                  <TableCell align="left">{getFullName(student)}</TableCell>
                  <TableCell align="left">{student.fecha_Ingreso}</TableCell>
                  <TableCell align="right" sx={{ display: "flex" }}>
                    <div className="action-btn">
                      <Tooltip title="Eliminar" placement="top">
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleClickOpenDelete(student)}
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
                          onClick={() => handleOpenEdit(student)}
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
          count={students.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog TransitionProps={{ onEntering: handleEntering }} open={openAdd}>
          <DialogContent>
            <ModalStudent
              isEdit={false}
              student={null}
              handleClose={handleCloseAdd}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          TransitionProps={{ onEntering: handleEntering }}
          open={openEdit}
        >
          <DialogContent>
            <ModalStudent
              isEdit={true}
              student={studentEdit}
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
            {"¿Está seguro que desea eliminar el alumno?"}
          </DialogTitle>
          <DialogActions>
            <Button color="success" onClick={handleDelete}>
              Aceptar
            </Button>
            <Button color="error" onClick={handleCloseDelete} autoFocus>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Footer />
    </>
  );
};

export default StudentTable;
