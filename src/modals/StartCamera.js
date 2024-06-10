import React, { useState, useEffect, useContext, useCallback } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Typography,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import "../styles/styleStartCamera.css";
import CursoController from "../serviceApi/CursoController";
import EdicionCursoController from "../serviceApi/EdicionCursoController";
import InscripcionController from "../serviceApi/InscripcionController";
import UsuarioController from "../serviceApi/UsuarioController";
import EspacioController from "../serviceApi/EspacioController";
import PeriodoController from "../serviceApi/PeriodoController";
import { AuthContext } from "../contexts/AuthContext";

function StartCamera({ cameraTitle, onStart, handleClose }) {
  const { dataUser, token } = useContext(AuthContext);
  const [courseOptions, setCourseOptions] = useState([]);
  const [courseInfo, setCourseInfo] = useState({
    IdCurso: "",
    NombreCurso: "",
    IdProfesor: "",
    NombreProfesor: "",
    IdEspacio: "",
    NombreEspacio: "",
    IdPeriodo: "",
    NombrePeriodo: "",
    IdOrganizacion: "",
    IdEdicionCurso: "",
    Alumnos: [],
  });



  const fetchCursos = useCallback(async () => {
    try {
      const cursos = await CursoController.GetCursos(
        dataUser.IdOrganizacion,
        token
      );

      const fetchedUsers = await UsuarioController.getUsers(2, token);
      const fetchedSpaces = await EspacioController.GetSpaces(
        dataUser.IdOrganizacion,
        token
      );
      const fetchedPeriods = await PeriodoController.GetPeriods(
        dataUser.IdOrganizacion,
        token
      );

      const cursosConEdicionesYInscripciones = await Promise.all(
        cursos.map(async (curso) => {
          try {
            const edicionCursos = await EdicionCursoController.GetEdicionCurso(
              curso.id,
              token
            );

            const edicionesConInscripciones = await Promise.all(
              edicionCursos.map(async (edicion) => {
                try {
                  const inscripciones =
                    await InscripcionController.SearchInscripcion(
                      edicion.id,
                      token
                    );

                  const usuario = fetchedUsers.find(
                    (user) => user.id === edicion.idUsuario
                  );

                  const espacio = fetchedSpaces.find(
                    (space) => space.id === edicion.idEspacio
                  );

                  const periodo = fetchedPeriods.find(
                    (period) => period.id === edicion.idPeriodo
                  );

                  return {
                    ...edicion,
                    inscripcions: inscripciones,
                    usuario: usuario || null,
                    espacio: espacio || null,
                    periodo: periodo || null,
                  };
                } catch (error) {
                  console.error(
                    `Error fetching inscripciones for edicion ${edicion.id}:`,
                    error
                  );
                  return {
                    ...edicion,
                    inscripcions: [],
                    usuario: null,
                    espacio: null,
                    periodo: null,
                  };
                }
              })
            );

            return { ...curso, edicionCursos: edicionesConInscripciones };
          } catch (error) {
            console.error(
              `Error fetching edicion for curso ${curso.id}:`,
              error
            );
            return { ...curso, edicionCursos: [] };
          }
        })
      );

      setCourseOptions(cursosConEdicionesYInscripciones);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [dataUser.IdOrganizacion, token]);

  useEffect(() => {
    fetchCursos();
  }, [fetchCursos]);

  const handleCourseChange = (event, value) => {
    if (value) {
      const edicionCurso = value.edicionCursos[0];
      const nombreProfesor =
        edicionCurso && edicionCurso.usuario
          ? `${edicionCurso.usuario.primer_Nombre} ${
              edicionCurso.usuario.segundo_Nombre
                ? edicionCurso.usuario.segundo_Nombre + " "
                : ""
            }${edicionCurso.usuario.primer_Apellido} ${
              edicionCurso.usuario.segundo_Apellido
            }`
          : "";
      setCourseInfo({
        IdCurso: value.id,
        NombreCurso: value.nombre,
        IdProfesor:
          edicionCurso && edicionCurso.usuario ? edicionCurso.usuario.id : "",
        NombreProfesor: nombreProfesor,
        IdEspacio:
          edicionCurso && edicionCurso.espacio ? edicionCurso.espacio.id : "",
        NombreEspacio:
          edicionCurso && edicionCurso.espacio
            ? edicionCurso.espacio.nombre
            : "",
        IdPeriodo:
          edicionCurso && edicionCurso.periodo ? edicionCurso.periodo.id : "",
        NombrePeriodo:
          edicionCurso && edicionCurso.periodo
            ? edicionCurso.periodo.nombre
            : "",
        IdOrganizacion: dataUser.IdOrganizacion,
        IdEdicionCurso: edicionCurso ? edicionCurso.id : "",
        Alumnos: edicionCurso ? edicionCurso.inscripcions : [],
      });
    } else {
      setCourseInfo({
        IdCurso: "",
        NombreCurso: "",
        IdProfesor: "",
        NombreProfesor: "",
        IdEspacio: "",
        NombreEspacio: "",
        IdPeriodo: "",
        NombrePeriodo: "",
        IdOrganizacion: "",
        IdEdicionCurso: "",
        Alumnos: [],
      });
    }
  };

  const handleStart = () => {
    onStart(courseInfo);
  };

  return (
    <div className="container-modal">
      <h2>Iniciar Cámara</h2>
      <Box>
        <div>
          <Typography variant="h6" gutterBottom>
            Título de la Cámara: {cameraTitle}
          </Typography>
          <br />
          <FormControl fullWidth>
            <FormLabel>Selecciona un Curso:</FormLabel>
            <Autocomplete
              options={courseOptions}
              getOptionLabel={(option) => option.nombre || ""}
              onChange={handleCourseChange}
              renderInput={(params) => (
                <TextField {...params} label="Cursos" variant="outlined" />
              )}
            />
          </FormControl>
          {courseInfo.NombreEspacio && (
            <TextField
              label="Nombre del Espacio"
              value={courseInfo.NombreEspacio}
              margin="normal"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          )}
          {courseInfo.NombrePeriodo && (
            <TextField
              label="Nombre del Periodo"
              value={courseInfo.NombrePeriodo}
              margin="normal"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          )}
          {courseInfo.NombreProfesor && (
            <TextField
              label="Nombre del Profesor"
              value={courseInfo.NombreProfesor}
              margin="normal"
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          )}
          <Box mt={2}>
            <Button color="primary" onClick={handleStart}>
              Iniciar
            </Button>
            <Button color="error" onClick={handleClose}>
              Cancelar
            </Button>
          </Box>
        </div>
      </Box>
    </div>
  );
}

export default StartCamera;
