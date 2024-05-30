import React, { useState, useContext } from "react";
import { Box, Button, TextField } from "@mui/material";
import CursoController from "../serviceApi/CursoController";
import { AuthContext } from "../contexts/AuthContext";

const ModalCurso = ({ isEdit, data, handleClose }) => {
  const { dataUser, token } = useContext(AuthContext);

  const [courseData, setCourseData] = useState({
    id: isEdit && data ? data.id : "",
    nombre: isEdit && data ? data.nombre : "",
    codigoCurso: isEdit && data ? data.codigoCurso : "",
    nombreVariante: isEdit && data ? data.nombreVariante : "",
    descripcion: isEdit && data ? data.descripcion : "",
    idOrganizacion: parseInt(dataUser.IdOrganizacion),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (isEdit) {
        await CursoController.UpdateCurso(courseData, token);
      } else {
        await CursoController.InsertCurso(courseData, token);
      }
      handleClose();
    } catch (error) {
      console.error("Error al guardar el curso:", error);
    }
  };

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Editar un curso" : "Agregar un curso"}</h2>

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
            id="outlined-name"
            label="Nombre"
            name="nombre"
            value={courseData.nombre || ""}
            onChange={handleChange}
          />
          <TextField
            id="outlined-codigoCurso"
            label="Código del Curso"
            name="codigoCurso"
            value={courseData.codigoCurso || ""}
            onChange={handleChange}
          />
          <TextField
            id="outlined-nombreVariante"
            label="Nombre Variante"
            name="nombreVariante"
            value={courseData.nombreVariante || ""}
            onChange={handleChange}
          />
          <TextField
            id="outlined-descripcion"
            label="Descripción"
            name="descripcion"
            value={courseData.descripcion || ""}
            onChange={handleChange}
          />

          <div className="button-container">
            <Button sx={{ mt: 2 }} onClick={handleSave}>
              {isEdit ? "Editar" : "Crear"}
            </Button>
            <Button sx={{ mt: 2 }} color="error" onClick={handleClose}>
              Cancelar
            </Button>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default ModalCurso;
