import { Box, Button, TextField, Autocomplete } from "@mui/material";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";
import AlumnoController from "../serviceApi/AlumnoController";
import PersonaController from "../serviceApi/PersonaController";
import {
  getCountrys,
  getStates,
  getCantones,
  getDistricts,
} from "../serviceApi/UbicacionController";

const ModalStudent = ({ isEdit, student, handleClose }) => {
  const { dataUser, token } = useContext(AuthContext);
  const [statesOptions, setStatesOptions] = useState([]);
  const [countrysOptions, setCountrysOptions] = useState([]);
  const [cantonesOptions, setCantonesOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [selectedIdentifyName, setSelectedIdentifyName] = useState(null);
  const [currentFieldName, setCurrentFieldName] = useState("");

  const optionsIdentify = [
    { id: 1, nombre: "Cedula de identidad" },
    { id: 2, nombre: "Carnet de Extranjería" },
    { id: 3, nombre: "Pasaporte" },
  ];

  const [studentData, setStudentData] = useState({
    id: isEdit ? student.id : "",
    fechaIngreso: isEdit ? student.fecha_Ingreso : "",
    idOrganizacion: parseInt(dataUser.IdOrganizacion),
  });

  const [personData, setPersonData] = useState({
    firstName: isEdit ? student.primer_Nombre : "",
    secondName: isEdit ? student.segundo_Nombre : "",
    firstLastName: isEdit ? student.primer_Apellido : "",
    secondLastName: isEdit ? student.segundo_Apellido : "",
    typeIdentify: isEdit ? student.tipo_Identificacion : null,
    numberIdentify: isEdit ? student.numero_Identificacion : "",
    country: isEdit ? student.id_Pais : null,
    state: isEdit ? student.id_Estado_Provincia : null,
    canton: isEdit ? student.id_Canton : null,
    district: isEdit ? student.id_Distrito : null,
    city: isEdit ? student.ciudad : "",
    direction: isEdit ? student.direccion : "",
    postalMail: isEdit ? student.apartado_Postal : "",
    cellphoneNumber: isEdit ? student.telefono : "",
    mail: isEdit ? student.correo_Electronico : "",
  });

  const fetchData = useCallback(async () => {
    try {
      const dataCountrys = await getCountrys(token);
      setCountrysOptions(dataCountrys);

      if (personData.country) {
        const dataStates = await getStates(personData.country, token);
        setStatesOptions(dataStates);
      }
      if (personData.state) {
        const dataCantones = await getCantones(personData.state, token);
        setCantonesOptions(dataCantones);
      }
      if (personData.canton) {
        const dataDistrict = await getDistricts(personData.canton, token);
        setDistrictOptions(dataDistrict);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }, [personData.country, personData.state, personData.canton, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePersonChange = (e) => {
    const { name, value } = e.target;
    setPersonData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAdd = async () => {
    try {
      const personResponse = await PersonaController.InsertPerson(
        personData,
        token
      );
      if (personResponse.id) {
        const newStudentData = {
          ...studentData,
          idPersona: personResponse.id,
        };
        await AlumnoController.InsertAlumno(newStudentData, token);
        handleClose();
      }
    } catch (error) {
      console.error("Error al insertar el alumno:", error);
    }
  };
  const handleEdit = async () => {
    try {
      await PersonaController.UpdatePerson(
        personData,
        student.id_Persona,
        token
      );
      await AlumnoController.UpdateAlumno(studentData, token);
      handleClose();
    } catch (error) {
      console.error("Error al modificar el alumno:", error);
    }
  };

  const handleFocus = (fieldName) => {
    setCurrentFieldName(fieldName);
  };

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Editar un alumno" : "Agregar un alumno"}</h2>

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
            id="outlined-firstName"
            label="Primer Nombre"
            name="firstName"
            value={personData.firstName}
            onChange={handlePersonChange}
            onFocus={() => handleFocus("firstName")}
          />
          <TextField
            id="outlined-secondName"
            label="Segundo Nombre"
            name="secondName"
            value={personData.secondName}
            onChange={handlePersonChange}
            onFocus={() => handleFocus("secondName")}
          />
          <TextField
            id="outlined-firstLastName"
            label="Primer Apellido"
            name="firstLastName"
            value={personData.firstLastName}
            onChange={handlePersonChange}
            onFocus={() => handleFocus("firstLastName")}
          />
          <TextField
            id="outlined-secondLastName"
            label="Segundo Apellido"
            name="secondLastName"
            value={personData.secondLastName}
            onChange={handlePersonChange}
            onFocus={() => handleFocus("secondLastName")}
          />
          <Autocomplete
            value={
              optionsIdentify.find(
                (option) => option.id === personData.typeIdentify
              ) || null
            }
            onChange={(event, value) => {
              const selectedIdentify = optionsIdentify.find(
                (identify) => identify.id === value?.id
              );
              setPersonData({
                ...personData,
                typeIdentify: selectedIdentify ? selectedIdentify.id : null,
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            options={optionsIdentify}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Tipo de identificación"
                sx={{ m: 1, minWidth: 200 }}
              />
            )}
          />
          <TextField
            id="outlined-numberIdentify"
            label="Número de Identificación"
            name="numberIdentify"
            value={personData.numberIdentify}
            onChange={handlePersonChange}
            onFocus={() => handleFocus("numberIdentify")}
          />
          <Autocomplete
            value={
              countrysOptions.find(
                (option) => option.id === personData.country
              ) || null
            }
            onChange={(event, value) => {
              const selectedCountry = countrysOptions.find(
                (country) => country.id === value?.id
              );
              setPersonData({
                ...personData,
                country: selectedCountry ? selectedCountry.id : null,
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            options={countrysOptions}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="País"
                sx={{ m: 1, minWidth: 200 }}
              />
            )}
          />
          <Autocomplete
            value={
              statesOptions.find((option) => option.id === personData.state) ||
              null
            }
            onChange={(event, value) => {
              const selectedState = statesOptions.find(
                (state) => state.id === value?.id
              );
              setPersonData({
                ...personData,
                state: selectedState ? selectedState.id : null,
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            options={statesOptions}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Estado/Provincia"
                sx={{ m: 1, minWidth: 200 }}
              />
            )}
          />
          <Autocomplete
            value={
              cantonesOptions.find(
                (option) => option.id === personData.canton
              ) || null
            }
            onChange={(event, value) => {
              const selectedCanton = cantonesOptions.find(
                (canton) => canton.id === value?.id
              );
              setPersonData({
                ...personData,
                canton: selectedCanton ? selectedCanton.id : null,
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            options={cantonesOptions}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Cantón"
                sx={{ m: 1, minWidth: 200 }}
              />
            )}
          />
          <Autocomplete
            value={
              districtOptions.find(
                (option) => option.id === personData.district
              ) || null
            }
            onChange={(event, value) => {
              const selectedDistrict = districtOptions.find(
                (district) => district.id === value?.id
              );
              setPersonData({
                ...personData,
                district: selectedDistrict ? selectedDistrict.id : null,
              });
            }}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            options={districtOptions}
            getOptionLabel={(option) => option.nombre || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Distrito"
                sx={{ m: 1, minWidth: 200 }}
              />
            )}
          />
          <TextField
            id="outlined-city"
            label="Ciudad"
            name="city"
            value={personData.city}
            onChange={handlePersonChange}
            onFocus={() => handleFocus("city")}
          />
          <TextField
            id="outlined-direction"
            label="Dirección"
            name="direction"
            value={personData.direction}
            onChange={handlePersonChange}
            onFocus={() => handleFocus("direction")}
          />
          <TextField
            id="outlined-postalMail"
            label="Apartado Postal"
            name="postalMail"
            value={personData.postalMail}
            onChange={handlePersonChange}
            onFocus={() => handleFocus("postalMail")}
          />
          <TextField
            id="outlined-cellphoneNumber"
            label="Número de Teléfono"
            name="cellphoneNumber"
            value={personData.cellphoneNumber}
            onChange={handlePersonChange}
            onFocus={() => handleFocus("cellphoneNumber")}
          />
          <TextField
            id="outlined-mail"
            label="Correo Electrónico"
            name="mail"
            value={personData.mail}
            onChange={handlePersonChange}
            onFocus={() => handleFocus("mail")}
          />
          <TextField
            id="outlined-fechaIngreso"
            label="Fecha Ingreso"
            name="fechaIngreso"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={studentData.fechaIngreso}
            onChange={handleChange}
          />
          <br />
          <div className="button-container">
            <Button sx={{ mt: 2 }} onClick={isEdit ? handleEdit : handleAdd}>
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

export default ModalStudent;
