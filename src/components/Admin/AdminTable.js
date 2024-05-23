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
  DialogTitle,
  DialogActions,
  Button,
  Dialog,
} from "@mui/material";
import React, { useState, useContext, useEffect, useCallback } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { AuthContext } from "../../contexts/AuthContext";
import Header from "../Header";
import Footer from "../Footer";
import AdminDialog from "./AdminDialog";
import PersonaController from "../../serviceApi/PersonaController";
import UsuarioController from "../../serviceApi/UsuarioController";

const AdminTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [adminProcess, setAdminProcess] = useState(null);
  const [admins, setAdmins] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchAdmins = useCallback(async () => {
    try {
      const result = await UsuarioController.getUsers(2, token);
      setAdmins(result);
    } catch (error) {
      console.error("Error al obtener los admins:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const handleOpenEdit = (admin) => {
    setAdminProcess(admin);
    setOpenEdit(true);
  };

  const handleOpenAdd = () => setOpenAdd(true);

  const handleCloseEdit = () => setOpenEdit(false);

  const handleCloseAdd = () => setOpenAdd(false);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDelete = (admin) => {
    console.log(admin);
    setAdminProcess(admin);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => setOpenDelete(false);

  const handleDelete = async () => {
    try {
      const result = await PersonaController.DeletePerson(
        adminProcess.id,
        token
      );

      if (result) {
        try {
          const confirm = await UsuarioController.DeleteUser(
            adminProcess.nombre_Usuario,
            token
          );
          console.log("Eliminado correctamente ", confirm);
          handleCloseDelete();
        } catch (error) {
          console.error("Error: ", error);
        }
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

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

                  <TableCell align="right" sx={{ display: "flex" }}>
                    <div className="action-btn">
                      <Tooltip title="Eliminar" placement="top">
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleOpenDelete(admin)}
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
        <AdminDialog
          open={openAdd}
          handleClose={handleCloseAdd}
          isEdit={false}
          admin={null}
        />
        <AdminDialog
          open={openEdit}
          handleClose={handleCloseEdit}
          isEdit={true}
          admin={adminProcess}
        />
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

export default AdminTable;
