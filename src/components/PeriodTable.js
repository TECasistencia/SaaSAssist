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
import ModalPeriod from "../modals/ModalPeriod";
import PeriodoController from "../serviceApi/PeriodoController";
import { AuthContext } from "../contexts/AuthContext";
import Footer from "./Footer";

const PeriodTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [periodEdit, setPeriodEdit] = useState(null);
  const [periods, setPeriods] = useState([]);
  const [periodToDelete, setPeriodToDelete] = useState(null);

  const { dataUser, token } = useContext(AuthContext);
  const dialogRef = React.useRef(null);
  const idOrganizacion = parseInt(dataUser.IdOrganizacion);

  const fetchPeriods = useCallback(async () => {
    try {
      const fetchedPeriods = await PeriodoController.GetPeriods(
        idOrganizacion,
        token
      );
      setPeriods(fetchedPeriods);
    } catch (error) {
      console.error("Error fetching periods:", error);
    }
  }, [idOrganizacion, token]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleCloseAdd = () => {
    setOpenAdd(false);
    fetchPeriods();
  };

  const handleOpenEdit = (period) => {
    setPeriodEdit(period);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    fetchPeriods();
  };

  const handleClickOpenDelete = (period) => {
    setPeriodToDelete(period);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleDelete = async () => {
    try {
      await PeriodoController.DeletePeriod(periodToDelete.id, token);
      handleCloseDelete();
      fetchPeriods();
    } catch (error) {
      console.error("Error deleting period:", error);
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
        <h2>Periodos</h2>
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
                <TableCell align="left">Fecha Inicio</TableCell>
                <TableCell align="left">Fecha Fin</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? periods.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : periods
              ).map((period) => (
                <TableRow
                  key={period.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {period.id}
                  </TableCell>
                  <TableCell align="left">{period.nombre}</TableCell>
                  <TableCell align="left">{period.fechaInicio}</TableCell>
                  <TableCell align="left">{period.fechaFin}</TableCell>
                  <TableCell align="right" sx={{ display: "flex" }}>
                    <div className="action-btn">
                      <Tooltip title="Eliminar" placement="top">
                        <IconButton
                          color="error"
                          aria-label="delete"
                          onClick={() => handleClickOpenDelete(period)}
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
                          onClick={() => handleOpenEdit(period)}
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
          count={periods.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
        <Dialog TransitionProps={{ onEntering: handleEntering }} open={openAdd}>
          <DialogContent>
            <ModalPeriod
              isEdit={false}
              period={null}
              handleClose={handleCloseAdd}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          TransitionProps={{ onEntering: handleEntering }}
          open={openEdit}
        >
          <DialogContent>
            <ModalPeriod
              isEdit={true}
              period={periodEdit}
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
            {"¿Está seguro que desea eliminar el periodo?"}
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

export default PeriodTable;
