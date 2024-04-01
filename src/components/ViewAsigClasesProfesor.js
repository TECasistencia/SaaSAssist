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
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

import Header from "./Header";
import ModalClass from "../modals/ModalClass";

const ViewAsigClasesProfesor = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [userEdit, setUserEdit] = useState();

  const dialogRef = React.useRef(null);

  const Users = [
    {
      id: "1",
      name: "Luciano",
      lastName: "Perez Chavarria",
      asigClass: "Introducción",
    },
    {
      id: "2",
      name: "Jaime",
      lastName: "Hernandez",
      asigClass: "Introducción",
    },
    {
      id: "3",
      name: "Rogelio",
      lastName: "Barboza",
      asigClass: "Introducción",
    },
    {
      id: "4",
      name: "Denis",
      lastName: "Fernandez",
      asigClass: "Introducción",
    },
    {
      id: "5",
      name: "Gerardo",
      lastName: "Espinoza",
      asigClass: "Introducción",
    },
    {
      id: "6",
      name: "Belen",
      lastName: "Lara",
      asigClass: "Introducción",
    },
  ];

  const handleOpenEdit = (user) => {
    setUserEdit(user);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
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

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <>
      <Header />
      <div className="container">
        <h2>Asignar Clases</h2>

        <TableContainer sx={{ width: "80rem" }} component={Paper}>
          <Table sx={{ width: "80rem" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="left">Nombre</TableCell>
                <TableCell align="left">Apellidos</TableCell>
                <TableCell align="left">Clases Asignadas</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? Users.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : Users
              ).map((user) => (
                <TableRow
                  key={user.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.id}
                  </TableCell>
                  <TableCell align="left">{user.name}</TableCell>
                  <TableCell align="left">{user.lastName}</TableCell>
                  <TableCell align="left">{user.asigClass}</TableCell>
                  <TableCell align="right" sx={{ display: "flex" }}>
                    <div className="action-btn">
                      <Tooltip title="Editar" placement="top">
                        <IconButton
                          color="success"
                          aria-label="edit"
                          onClick={() => handleOpenEdit(user)}
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
          count={Users.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog TransitionProps={{ onEntering: handleEntering }} open={openAdd}>
          <DialogContent>
            <ModalClass
              isEdit={false}
              user={null}
              handleClose={handleCloseAdd}
            />
          </DialogContent>
        </Dialog>

        <Dialog
          TransitionProps={{ onEntering: handleEntering }}
          open={openEdit}
        >
          <DialogContent>
            <ModalClass
              isEdit={true}
              user={userEdit}
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
            {"¿Está seguro que desea eliminar el usuario?"}
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

export default ViewAsigClasesProfesor;
