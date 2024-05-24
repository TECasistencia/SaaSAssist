import React, { useState, useEffect, useContext, useCallback } from "react";
import { Box, Button, TextField, Autocomplete } from "@mui/material";
import EspacioController from "../serviceApi/EspacioController";
import PeriodoController from "../serviceApi/PeriodoController";
import CursoController from "../serviceApi/CursoController";
import EdicionCursoController from "../serviceApi/EdicionCursoController";
import { AuthContext } from "../contexts/AuthContext";

const ModalCurso = ({ isEdit, data, handleClose }) => {
  const { dataUser, token } = useContext(AuthContext);

  const [courseData, setCourseData] = useState({
    id: isEdit && data ? data.id : "",
    nombre: isEdit && data ? data.nombre : "",
    codigoCurso: isEdit && data ? data.codigoCurso : "",
    nombreVariante: isEdit && data ? data.nombreVariante : "",
    descripcion: isEdit && data ? data.descripcion : "",
    spaceId: isEdit && data ? data.spaceId : null,
    periodId: isEdit && data ? data.periodId : null,
    fechaInicio: isEdit && data ? data.fechaInicio : "",
    fechaFin: isEdit && data ? data.fechaFin : "",
    idOrganizacion: parseInt(dataUser.IdOrganizacion),
  });
  const [spaces, setSpaces] = useState([]);
  const [periods, setPeriods] = useState([]);

  const fetchSpaces = useCallback(async () => {
    try {
      const fetchedSpaces = await EspacioController.GetSpaces(
        dataUser.IdOrganizacion,
        token
      );
      setSpaces(fetchedSpaces);
    } catch (error) {
      console.error("Error fetching spaces:", error);
    }
  }, [dataUser.IdOrganizacion, token]);

  const fetchPeriods = useCallback(async () => {
    try {
      const fetchedPeriods = await PeriodoController.GetPeriods(
        dataUser.IdOrganizacion,
        token
      );
      setPeriods(fetchedPeriods);
    } catch (error) {
      console.error("Error fetching periods:", error);
    }
  }, [dataUser.IdOrganizacion, token]);

  const fetchEdicionCurso = useCallback(
    async (courseId) => {
      try {
        const edicionCurso = await EdicionCursoController.GetEdicionCurso(
          courseId,
          token
        );
        if (edicionCurso && edicionCurso.length > 0) {
          const edicion = edicionCurso[0]; // Suponiendo que devuelva un array
          setCourseData((prevState) => ({
            ...prevState,
            spaceId: edicion.idEspacio,
            periodId: edicion.idPeriodo,
            fechaInicio: edicion.fechaInicio,
            fechaFin: edicion.fechaFin,
            edicionId: edicion.id,
          }));
        }
      } catch (error) {
        console.error("Error fetching edicion curso:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchSpaces();
    fetchPeriods();
    if (isEdit && data && data.id) {
      fetchEdicionCurso(data.id);
    }
  }, [fetchSpaces, fetchPeriods, isEdit, data, fetchEdicionCurso]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectSpace = (event, value) => {
    setCourseData((prevState) => ({
      ...prevState,
      spaceId: value ? value.id : null,
    }));
  };

  const handleSelectPeriod = (event, value) => {
    setCourseData((prevState) => ({
      ...prevState,
      periodId: value ? value.id : null,
    }));
  };

  const handleSave = async () => {
    try {
      let newCourse;
      if (isEdit) {
        newCourse = await CursoController.UpdateCurso(courseData, token);
        const updatedEdicionCurso = {
          Id: courseData.edicionId,
          IdCurso: courseData.id,
          IdPeriodo: courseData.periodId,
          IdEspacio: courseData.spaceId,
          NombreGrupo: courseData.nombre,
          FechaInicio: courseData.fechaInicio,
          FechaFin: courseData.fechaFin,
        };
        await EdicionCursoController.UpdateEdicionCurso(
          updatedEdicionCurso,
          token
        );
      } else {
        newCourse = await CursoController.InsertCurso(courseData, token);
        const newEdicionCurso = {
          IdCurso: newCourse.id,
          IdPeriodo: courseData.periodId,
          IdEspacio: courseData.spaceId,
          NombreGrupo: courseData.nombre,
          FechaInicio: courseData.fechaInicio,
          FechaFin: courseData.fechaFin,
        };
        await EdicionCursoController.InsertEdicionCurso(newEdicionCurso, token);
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
          <TextField
            id="outlined-fechaInicio"
            label="Fecha Inicio"
            name="fechaInicio"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={courseData.fechaInicio || ""}
            onChange={handleChange}
          />
          <TextField
            id="outlined-fechaFin"
            label="Fecha Fin"
            name="fechaFin"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={courseData.fechaFin || ""}
            onChange={handleChange}
          />
          <Autocomplete
            options={spaces}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => (
              <TextField {...params} label="Espacio" variant="outlined" />
            )}
            value={
              spaces.find((space) => space.id === courseData.spaceId) || null
            }
            onChange={handleSelectSpace}
          />
          <Autocomplete
            options={periods}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => (
              <TextField {...params} label="Periodo" variant="outlined" />
            )}
            value={
              periods.find((period) => period.id === courseData.periodId) ||
              null
            }
            onChange={handleSelectPeriod}
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
