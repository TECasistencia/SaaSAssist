import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState } from "react";

const ModalAdmin = ({ isEdit, admin, handleClose }) => {
  const [id, setid] = useState(isEdit ? admin.id : "");
  const [Name, setName] = useState(isEdit ? admin.name : "");
  const [LastName, setLastName] = useState(isEdit ? admin.lastName : "");
  const [Mail, setMail] = useState(isEdit ? admin.mail : "");
  const [Images, setImages] = useState(null);
  const dialogRef = React.useRef(null);

  const [openSubirImages, setOpenSubirImages] = useState(false);
  const [urlImages, setUrlImages] = useState("");
  const [fileNameImages, setFileNameImages] = useState(
    "No hay archivo seleccionado"
  );
  const handleOpenSubirImages = () => {
    setOpenSubirImages(true);
  };
  const handleCloseSubirImages = () => {
    setOpenSubirImages(false);
    setImages(null);
    setFileNameImages("No hay archivo seleccionado");
  };


  const handleEntering = () => {
    if (dialogRef.current != null) {
      dialogRef.current.focus();
    }
  };

  const handleChangeId = (e) => {
    const inputValue = e.target.value;
    setid(inputValue);
  };
  const handleChangeName = (e) => {
    const inputValue = e.target.value;
    setName(inputValue);
  };
  const handleChangeLastName = (e) => {
    const inputValue = e.target.value;
    setLastName(inputValue);
  };
  const handleChangeMail = (e) => {
    const inputValue = e.target.value;
    setMail(inputValue);
  };
  const handleChangeImages = (e) => {
    const inputValue = e.target.value;
    setImages(inputValue);
  };

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Editar administrador" : "Agregar un administrador"}</h2>

      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1, width: "20rem" },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <TextField
            id="outlined"
            label="ID"
            value={id}
            onChange={handleChangeId}
            disabled
          />
          <TextField
            id="outlined"
            label="Nombre"
            value={Name}
            onChange={handleChangeName}
          />
          <TextField
            id="outlined"
            label="Apellidos"
            value={LastName}
            onChange={handleChangeLastName}
          />
          <TextField
            id="outlined"
            label="Correo"
            value={Mail}
            onChange={handleChangeMail}
          />

          <div className="logo-pagina">
            <h3>Imagenes del sujeto</h3>
            <div className="logo-box">
              <img
                style={{ maxWidth: "500px", borderRadius: "5px" }}
                src={urlImages !== "" ? urlImages : ""}
                alt=""
              />
            </div>
            <Button
              variant="outlined"
              sx={{ mt: "1rem", width: "10rem" }}
              onClick={handleOpenSubirImages}
            >
              Subir Imagenes
            </Button>
          </div>
          <br />
          <div className="button-container">
            <Button sx={{ mt: 2 }}>Editar</Button>
            <Button sx={{ mt: 2 }} color="error" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </Box>
      <Dialog
        TransitionProps={{ onEntering: handleEntering }}
        open={openSubirImages}
      >
        <DialogContent>
          <div className="logo-pagina">
            <h3>Imágenes a subir</h3>
            <form
              className="form-logo"
              action=""
              onClick={() => document.querySelector(".input-logo").click()}
            >
              <input
                className="input-logo"
                type="file"
                accept="image/*"
                hidden
                onClick={(event) => {
                  event.target.value = null;
                }}
                onChange={({ target: { files } }) => {
                  files[0] && setFileNameImages(files[0].name);
                  if (files) {
                    setImages(files[0]);
                  }
                }}
              />
              {Images ? (
                <img
                  style={{ maxWidth: "500px", borderRadius: "5px" }}
                  src={URL.createObjectURL(Images)}
                  alt={fileNameImages}
                />
              ) : (
                <>
                  <CloudUploadIcon
                    color="primary"
                    sx={{ width: 40, height: 40 }}
                  />
                  <p>Subir un archivo</p>
                </>
              )}
            </form>
            <section className="uploaded-row">
              <DescriptionIcon color="primary" />
              <span>{fileNameImages}</span>
              <IconButton
                color="error"
                aria-label="delete"
                onClick={() => {
                  setFileNameImages("No hay archivo seleccionado");
                  setImages(null);
                }}
              >
                <Tooltip title="Eliminar erchivo seleccionado" placement="top">
                  <DeleteIcon />
                </Tooltip>
              </IconButton>
            </section>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="success">Guardar Imágenes</Button>
          <Button color="error" onClick={handleCloseSubirImages} autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ModalAdmin;
