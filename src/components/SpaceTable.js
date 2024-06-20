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
import ModalSpace from "../modals/ModalSpace";
import EspacioController from "../serviceApi/EspacioController";

import { AuthContext } from "../contexts/AuthContext";
import Footer from "./Footer";

const SpaceTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [spaceEdit, setSpaceEdit] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [spaceToDelete, setSpaceToDelete] = useState(null);

  const { dataUser, token } = useContext(AuthContext);
  const dialogRef = React.useRef(null);
  const idOrganizacion = parseInt(dataUser.IdOrganizacion);

  const fetchSpaces = useCallback(async () => {
    try {
      const fetchedSpaces = await EspacioController.GetSpaces(
        idOrganizacion,
        token
      );
      setSpaces(fetchedSpaces);
    } catch (error) {
      console.error("Error fetching spaces:", error);
    }
  }, [idOrganizacion, token]);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  const handleOpenAdd = async () => {
    await fetchSpaces();
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchSpaces();
  };

  const handleOpenEdit = (space) => {
    setSpaceEdit(space);
    setOpenEdit(true);
    fetchSpaces();
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    fetchSpaces();
  };

  const handleClickOpenDelete = async (space) => {
    await fetchSpaces();
    setSpaceToDelete(space);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    fetchSpaces();
  };

  const handleDelete = async () => {
    try {
      await EspacioController.DeleteSpace(spaceToDelete.id, token);
      handleCloseDelete();
    } catch (error) {
      console.error("Error deleting space:", error);
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

  return (
    <>
      <Header />
      <div className="container">
        <h2>Espacios</h2>
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
                <TableCell align="left">Capacidad</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? spaces.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : spaces
              ).map((space) => (
                <TableRow
                  key={space.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {space.id}
                  </TableCell>
                  <TableCell align="left">{space.nombre}</TableCell>
                  <TableCell align="left">{space.capacidad}</TableCell>
                  <TableCell align="right" sx={{ display: "flex" }}>
                    <div className="action-btn">
                      <Tooltip title="Eliminar" placement="top">
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleClickOpenDelete(space)}
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
                          onClick={() => handleOpenEdit(space)}
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
          count={spaces.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog TransitionProps={{ onEntering: handleEntering }} open={openAdd}>
          <DialogContent>
            <ModalSpace
              isEdit={false}
              space={null}
              handleClose={handleCloseAdd}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          TransitionProps={{ onEntering: handleEntering }}
          open={openEdit}
        >
          <DialogContent>
            <ModalSpace
              isEdit={true}
              space={spaceEdit}
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
            {"¿Está seguro que desea eliminar el espacio?"}
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

export default SpaceTable;
