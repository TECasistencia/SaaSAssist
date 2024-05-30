import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { useState, useEffect, useContext, useCallback } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Header from "./Header";
import ModalGuest from "../modals/ModalGuest";
import UsuarioController from "../serviceApi/UsuarioController";
import PersonaController from "../serviceApi/PersonaController";
import { AuthContext } from "../contexts/AuthContext";

const GuestTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [guestEdit, setGuestEdit] = useState(null);
  const [guests, setGuests] = useState([]);
  const [guestToDelete, setGuestToDelete] = useState(null);
  const { token } = useContext(AuthContext);
  const dialogRef = React.useRef(null);

  const fetchGuests = useCallback(async () => {
    try {
      const guestData = await UsuarioController.getUsers(3, token);
      setGuests(guestData);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  }, [token]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  const handleOpenEdit = (guest) => {
    setGuestEdit(guest);
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

  const handleClickOpenDelete = (guest) => {
    setGuestToDelete(guest);
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const result = await PersonaController.DeletePerson(
        guestToDelete.id,
        token
      );
      if (result) {
        try {
          const confirm = await UsuarioController.DeleteUser(
            guestToDelete.nombre_Usuario,
            token
          );
          setOpenDelete(false);
          setGuestToDelete(null);
          fetchGuests();
        } catch (error) {
          console.error("Error: ", error);
        }
      }
    } catch (error) {
      console.error("Error deleting guest:", error);
    }
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setGuestToDelete(null);
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>Invitados (Padres)</h2>
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
                ? guests.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : guests
              ).map((guest) => (
                <TableRow
                  key={guest.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {guest.id}
                  </TableCell>
                  <TableCell align="left">{guest.primer_Nombre}</TableCell>
                  <TableCell align="left">{guest.primer_Apellido}</TableCell>
                  <TableCell align="left">{guest.correo_Electronico}</TableCell>
                  <TableCell align="right" sx={{ display: "flex" }}>
                    <div className="action-btn">
                      <Tooltip title="Eliminar" placement="top">
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleClickOpenDelete(guest)}
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
                          onClick={() => handleOpenEdit(guest)}
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
          count={guests.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog TransitionProps={{ onEntering: handleEntering }} open={openAdd}>
          <DialogContent>
            <ModalGuest
              isEdit={false}
              guest={null}
              handleClose={handleCloseAdd}
              fetchGuests={fetchGuests} // Pasa fetchGuests como prop
            />
          </DialogContent>
        </Dialog>

        <Dialog
          TransitionProps={{ onEntering: handleEntering }}
          open={openEdit}
        >
          <DialogContent>
            <ModalGuest
              isEdit={true}
              guest={guestEdit}
              handleClose={handleCloseEdit}
              fetchGuests={fetchGuests} // Pasa fetchGuests como prop
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
            {"¿Está seguro que desea eliminar el invitado?"}
          </DialogTitle>
          <DialogActions>
            <Button color="success" onClick={handleConfirmDelete}>
              Aceptar
            </Button>
            <Button color="error" onClick={handleCloseDelete} autoFocus>
              Cancelar
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default GuestTable;
