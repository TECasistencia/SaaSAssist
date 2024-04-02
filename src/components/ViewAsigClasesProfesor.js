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
} from "@mui/material";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";

import Header from "./Header";
import ModalAsigClass from "../modals/ModalAsigClass";

const ViewAsigClasesProfesor = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [userEdit, setUserEdit] = useState();

  const dialogRef = React.useRef(null);

  const Professors = [
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

  return (
    <>
      <Header />
      <div className="container">
        <h2>Asignar Clase</h2>

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
                ? Professors.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : Professors
              ).map((professor) => (
                <TableRow
                  key={professor.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {professor.id}
                  </TableCell>
                  <TableCell align="left">{professor.name}</TableCell>
                  <TableCell align="left">{professor.lastName}</TableCell>
                  <TableCell align="left">{professor.asigClass}</TableCell>
                  <TableCell align="right" sx={{ display: "flex" }}>
                    <div className="action-btn">
                      <Tooltip title="Editar" placement="top">
                        <IconButton
                          color="success"
                          aria-label="edit"
                          onClick={() => handleOpenEdit(professor)}
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
          count={Professors.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog TransitionProps={{ onEntering: handleEntering }} open={openAdd}>
          <DialogContent>
            <ModalAsigClass
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
            <ModalAsigClass
              isEdit={true}
              user={userEdit}
              handleClose={handleCloseEdit}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ViewAsigClasesProfesor;
