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
} from "@mui/material";
import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const AdminTable = () => {
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);
  const [openAdd, setOpenAdd] = useState(false);

  const Admins = [
    {
      id: "1",
      nombre: "Juan",
      apellidos: "Perez Chavarria",
      correo: "juanp@asrt.com",
      imagenes: "img1, img2",
    },
    {
      id: "2",
      nombre: "Luis",
      apellidos: "Castillo",
      correo: "luisc@ast.com",
      imagenes: "img1, img 2",
    },
    {
      id: "3",
      nombre: "Alison",
      apellidos: "Gonzalez Jara",
      correo: "luisc@ast.com",
      imagenes: "img1, img 2",
    },
    
  ];
  const handleOpenAdd = () => {
    setOpenAdd(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div className="container">
      <h2>Administradores</h2>
      <div style={{width:'70rem'}}>
        <Tooltip title="Agregar" placement="top">
          <IconButton onClick={handleOpenAdd} aria-label="add">
            <AddCircleIcon fontSize="large" color="primary" />
          </IconButton>
        </Tooltip>
      </div>

      <TableContainer sx={{width: "70rem" }} component={Paper}>
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
              ? Admins.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : Admins
            ).map((admin) => (
              <TableRow
                key={admin.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {admin.id}
                </TableCell>
                <TableCell align="left">{admin.nombre}</TableCell>
                <TableCell align="left">{admin.apellidos}</TableCell>
                <TableCell align="left">{admin.correo}</TableCell>
                <TableCell align="left">{admin.imagenes}</TableCell>
                <TableCell align="right" sx={{ display: "flex" }}>
                  <div className="action-btn">
                    <Tooltip title="Editar" placement="top">
                      <IconButton
                        color="success"
                        aria-label="edit"
                        // onClick={() => handleOpen(code)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </div>

                  <div className="action-btn">
                    <Tooltip title="Eliminar" placement="top">
                      <IconButton
                        color="error"
                        aria-label="delete"
                        // onClick={() => handleClickOpenDeleteDialog(code)}
                      >
                        <DeleteIcon />
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
        count={Admins.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};

export default AdminTable;
