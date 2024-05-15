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
import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../contexts/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";

import Header from "./Header";
import ModalAdmin from "../modals/ModalAdmin";
import Footer from "./Footer";
import AdminController from "../serviceApi/adminController";

const AdminTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [adminEdit, setAdminEdit] = useState();
  const [admins, setAdmins] = useState([]);
  const { token } = useContext(AuthContext);

  const dialogRef = React.useRef(null);

  const handleOpenEdit = (admin) => {
    setAdminEdit(admin);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
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

  const handleClickOpenDelete = (admin) => {
    // logica para eliminar el admin seleccionado
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const getAdmins = async () => {
    try {
      // Llamar a la función InsertPerson del controlador PersonaController
      const result = await AdminController.GetAdmins(2, token);
      setAdmins(result);

      // Aquí puedes hacer algo después de insertar la persona, como cerrar el modal
    } catch (error) {
      console.error("Error al insertar la persona:", error);
      // Aquí puedes manejar el error de alguna manera, como mostrando un mensaje al usuario
    }
  };

  useEffect(() => {
    getAdmins();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        <h2>Administradores (Profesores)</h2>
        <div style={{ width: "70rem" }}>
          <Tooltip title="Agregar" placement="top">
            <IconButton onClick={handleOpenAdd} aria-label="add">
              <AddCircleIcon fontSize="large" color="primary" />
            </IconButton>
          </Tooltip>
        </div>

        <TableContainer sx={{ width: "70rem" }} component={Paper}>
          <Table sx={{ width: "70rem" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="left">Nombre</TableCell>
                <TableCell align="left">Apellidos</TableCell>
                <TableCell align="left">Correo</TableCell>
                <TableCell align="left">Imagenes</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? admins.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : admins
              ).map((admin) => (
                <TableRow
                  key={admin.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {admin.id}
                  </TableCell>
                  <TableCell align="left">{admin.primer_Nombre}</TableCell>
                  <TableCell align="left">{admin.primer_Apellido}</TableCell>
                  <TableCell align="left">{admin.correo_Electronico}</TableCell>
                  <TableCell sx={{ paddingLeft: 3 }} align="left">
                    <Tooltip title="Ver imágenes" placement="top">
                      <IconButton color="info" aria-label="ver">
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right" sx={{ display: "flex" }}>
                    <div className="action-btn">
                      <Tooltip title="Eliminar" placement="top">
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleClickOpenDelete(admin)}
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
                          onClick={() => handleOpenEdit(admin)}
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
          sx={{ width: "70rem" }}
          component="div"
          rowsPerPageOptions={[5, 10, 25]}
          count={admins.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog TransitionProps={{ onEntering: handleEntering }} open={openAdd}>
          {/* <DialogTitle>Phone Ringtone</DialogTitle> */}
          <DialogContent>
            <ModalAdmin
              isEdit={false}
              admin={null}
              handleClose={handleCloseAdd}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          TransitionProps={{ onEntering: handleEntering }}
          open={openEdit}
        >
          <DialogContent>
            <ModalAdmin
              isEdit={true}
              admin={adminEdit}
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
            {"¿Está seguro que desea eliminar el admin?"}
          </DialogTitle>
          <DialogActions>
            <Button color="success">Aceptar</Button>
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

export default AdminTable;
