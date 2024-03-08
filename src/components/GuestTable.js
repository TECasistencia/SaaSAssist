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
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Header from "./Header";
import ModalGuest from "../modals/ModalGuest";

const GuestTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [guestEdit, setGuestEdit] = useState();

  const dialogRef = React.useRef(null);

  const Guests = [
    {
      id: "1",
      name: "Hugo",
      lastName: "Perez Chavarria",
      mail: "hugo@asrt.com",
      pass: "123",
    },
    {
      id: "2",
      name: "Fernando",
      lastName: "Castillo",
      mail: "fercas@ast.com",
      pass: "adr",
    },
    {
      id: "3",
      name: "Adriana",
      lastName: "Gonzalez Jara",
      mail: "adri@ast.com",
      pass: "esd",
    },
    {
      id: "4",
      name: "Rodrigo",
      lastName: "Perez Chavarria",
      mail: "rod@asrt.com",
      pass: "rer",
    },
    {
      id: "5",
      name: "Carlos",
      lastName: "Castillo",
      mail: "carlos@ast.com",
      pass: "wer",
    },
    {
      id: "6",
      name: "Samanta",
      lastName: "Gonzalez Jara",
      mail: "samgon@ast.com",
      pass: "rte",
    },
  ];

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
    // logica para eliminar el guest seleccionado
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
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
                <TableCell align="left">Contraseña</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? Guests.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : Guests
              ).map((guest) => (
                <TableRow
                  key={guest.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {guest.id}
                  </TableCell>
                  <TableCell align="left">{guest.name}</TableCell>
                  <TableCell align="left">{guest.lastName}</TableCell>
                  <TableCell align="left">{guest.mail}</TableCell>
                  <TableCell align="left">{guest.pass}</TableCell>
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
          count={Guests.length}
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
            <Button color="success">Aceptar</Button>
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
