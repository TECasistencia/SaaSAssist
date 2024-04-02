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
import ModalClassList from "../modals/ModalClassList";

const ViewClassList = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openEdit, setOpenEdit] = useState(false);
  const [userEdit, setUserEdit] = useState();

  const dialogRef = React.useRef(null);

  const Clases = [
    {
      id: "1",
      name: "Introducción a la Programación",
    },
    {
      id: "2",
      name: "Estructuras de Datos",
    },
    {
      id: "3",
      name: "Algoritmos y Complejidad",
    },
    {
      id: "4",
      name: "Bases de Datos",
    },
    {
      id: "5",
      name: "Ingeniería de Software",
    },
    {
      id: "6",
      name: "Desarrollo Web",
    },
  ];

  const handleOpenEdit = (data) => {
    setUserEdit(data);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
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
        <h2>Listas de alumnos por clase</h2>

        <TableContainer sx={{ width: "80rem" }} component={Paper}>
          <Table sx={{ width: "80rem" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="left">Nombre</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? Clases.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : Clases
              ).map((cls) => (
                <TableRow
                  key={cls.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {cls.id}
                  </TableCell>
                  <TableCell align="left">{cls.name}</TableCell>
                  <TableCell align="right" sx={{ display: "flex" }}>
                    <div className="action-btn">
                      <Tooltip title="Editar" placement="top">
                        <IconButton
                          color="success"
                          aria-label="edit"
                          onClick={() => handleOpenEdit(cls)}
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
          count={Clases.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog
          TransitionProps={{ onEntering: handleEntering }}
          open={openEdit}
        >
          <DialogContent>
            <ModalClassList data={userEdit} handleClose={handleCloseEdit} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ViewClassList;
