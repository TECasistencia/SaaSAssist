import React, { useState, useEffect, useContext, useCallback } from "react";
import { Box, Button, TextField, Autocomplete } from "@mui/material";
import EspacioController from "../serviceApi/EspacioController";
import PeriodoController from "../serviceApi/PeriodoController";
import UsuarioController from "../serviceApi/UsuarioController";
import EdicionCursoController from "../serviceApi/EdicionCursoController";
import { AuthContext } from "../contexts/AuthContext";

const ModalAsignarProfesor = ({ curso, handleClose }) => {
  const { dataUser, token } = useContext(AuthContext);

  const [courseData, setCourseData] = useState({
    idCurso: curso.id,
    idEspacio: curso.edicionCurso ? curso.edicionCurso.idEspacio : null,
    idPeriodo: curso.edicionCurso ? curso.edicionCurso.idPeriodo : null,
    idProfesor: curso.edicionCurso ? curso.edicionCurso.idProfesor : null,
    nombreEdicionCurso: curso.edicionCurso
      ? curso.edicionCurso.nombreGrupo
      : "",
    fechaInicio: curso.edicionCurso ? curso.edicionCurso.fechaInicio : "",
    fechaFin: curso.edicionCurso ? curso.edicionCurso.fechaFin : "",
    idOrganizacion: parseInt(dataUser.IdOrganizacion),
  });

  const [spaces, setSpaces] = useState([]);
  const [periods, setPeriods] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [selectedProfesor, setSelectedProfesor] = useState({
    idProfesor: curso.edicionCurso?.idUsuario || null,
    nombreProfesor: curso.nombreAdmin || "",
  });

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

  const fetchProfesores = useCallback(async () => {
    try {
      const fetchedProfesores = await UsuarioController.getUsers(2, token);
      setProfesores(fetchedProfesores);

      if (curso.nombreAdmin) {
        const selected = fetchedProfesores.find(
          (profesor) =>
            `${profesor.primer_Nombre} ${profesor.segundo_Nombre || ""} ${
              profesor.primer_Apellido
            } ${profesor.segundo_Apellido}` === curso.nombreAdmin
        );
        setSelectedProfesor({
          idProfesor: selected?.id || curso.edicionCurso?.idUsuario || null,
          nombreProfesor: curso.nombreAdmin || "",
        });
      }
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  }, [curso.nombreAdmin, curso.edicionCurso?.idUsuario, token]);

  useEffect(() => {
    fetchSpaces();
    fetchPeriods();
    fetchProfesores();
  }, [fetchSpaces, fetchPeriods, fetchProfesores]);

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
      idEspacio: value ? value.id : null,
    }));
  };

  const handleSelectPeriod = (event, value) => {
    const selectedPeriod = periods.find((period) => period.id === value?.id);
    setCourseData((prevState) => ({
      ...prevState,
      idPeriodo: selectedPeriod ? selectedPeriod.id : null,
      nombreEdicionCurso: `${curso.nombre} - ${
        selectedPeriod ? selectedPeriod.nombre : ""
      }`,
      fechaInicio: selectedPeriod ? selectedPeriod.fechaInicio : "",
      fechaFin: selectedPeriod ? selectedPeriod.fechaFin : "",
    }));
  };

  const handleSelectProfesor = (event, value) => {
    setSelectedProfesor({
      idProfesor: value ? value.id : null,
      nombreProfesor: value
        ? `${value.primer_Nombre} ${value.segundo_Nombre || ""} ${
            value.primer_Apellido
          } ${value.segundo_Apellido}`
        : "",
    });
    setCourseData((prevState) => ({
      ...prevState,
      idProfesor: value ? value.id : null,
    }));
  };

  const handleSave = async () => {
    try {
      const newEdicionCurso = {
        IdCurso: courseData.idCurso,
        IdPeriodo: courseData.idPeriodo,
        IdEspacio: courseData.idEspacio,
        IdProfesor: courseData.idProfesor
          ? courseData.idProfesor
          : selectedProfesor.idProfesor,
        NombreGrupo: courseData.nombreEdicionCurso,
        FechaInicio: courseData.fechaInicio,
        FechaFin: courseData.fechaFin,
      };

      if (curso.edicionCurso) {
        await EdicionCursoController.UpdateEdicionCurso(
          curso.edicionCurso.id,
          newEdicionCurso,
          token
        );
      } else {
        await EdicionCursoController.InsertEdicionCurso(newEdicionCurso, token);
      }

      handleClose();
    } catch (error) {
      console.error("Error al asignar el profesor:", error);
    }
  };

  return (
    <div className="container-modal">
      <h2>
        {curso.edicionCurso
          ? "Editar Profesor del Curso"
          : "Asignar Profesor al Curso"}
      </h2>

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
            label="Nombre del Curso"
            name="nombre"
            value={curso.nombre}
            disabled
          />
          <Autocomplete
            options={spaces}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => (
              <TextField {...params} label="Espacio" variant="outlined" />
            )}
            value={
              spaces.find((space) => space.id === courseData.idEspacio) || null
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
              periods.find((period) => period.id === courseData.idPeriodo) ||
              null
            }
            onChange={handleSelectPeriod}
          />
          <Autocomplete
            options={profesores}
            getOptionLabel={(option) =>
              `${option.primer_Nombre} ${option.segundo_Nombre || ""} ${
                option.primer_Apellido
              } ${option.segundo_Apellido}`
            }
            renderInput={(params) => (
              <TextField {...params} label="Profesor" variant="outlined" />
            )}
            value={
              profesores.find(
                (profesor) => profesor.id === selectedProfesor.idProfesor
              ) || null
            }
            onChange={handleSelectProfesor}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
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

          <div className="button-container">
            <Button sx={{ mt: 2 }} onClick={handleSave}>
              {curso.edicionCurso ? "Editar" : "Asignar"} Profesor
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

export default ModalAsignarProfesor;
