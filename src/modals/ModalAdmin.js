import { Box, Button, TextField, Autocomplete } from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import React, { useState, useEffect, useContext, useCallback } from "react";
import PersonaController from "../serviceApi/PersonaController";
import UsuarioController from "../serviceApi/UsuarioController";
import {
  getCountrys,
  getStates,
  getCantones,
  getDistricts,
} from "../serviceApi/UbicacionController";

const ModalAdmin = ({ isEdit, admin, handleClose }) => {
  const { dataUser, token } = useContext(AuthContext);

  const [statesOptions, setStatesOptions] = useState([]);
  const [countrysOptions, setCountrysOptions] = useState([]);
  const [cantonesOptions, setCantonesOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);

  const optionsActive = [
    { label: "Sí", value: true },
    { label: "No", value: false },
  ];
  const optionsIdentify = [
    { id: 1, nombre: "Cedula de identidad" },
    { id: 2, nombre: "Carnet de Extranjería" },
    { id: 3, nombre: "Pasaporte" },
  ];

  const fechaActual = new Date();
  const fechaFormateada = fechaActual.toLocaleDateString("en-CA");

  const [dataPerson, setDataPerson] = useState({
    mail: isEdit ? admin.correo_Electronico : "",
    typeIdentify: isEdit ? admin.tipo_Identificacion : "",
    country: isEdit ? admin.iD_Pais : "",
    state: isEdit ? admin.iD_Estado_Provincia : "",
    canton: isEdit ? admin.iD_Canton : "",
    district: isEdit ? admin.iD_Distrito : "",
    firstName: isEdit ? admin.primer_Nombre : "",
    secondName: isEdit ? admin.segundo_Nombre : "",
    cellphoneNumber: isEdit ? admin.telefono : "",
    firstLastName: isEdit ? admin.primer_Apellido : "",
    secondLastName: isEdit ? admin.segundo_Apellido : "",
    numberIdentify: isEdit ? admin.numero_Identificacion : "",
    city: isEdit ? admin.ciudad : "",
    direction: isEdit ? admin.direccion : "",
    postalMail: isEdit ? admin.apartado_Postal : "",
  });

  const [usuario, setUsuario] = useState({
    idOrganizacion: parseInt(dataUser.IdOrganizacion),
    nombreUsuario: isEdit ? admin.nombre_Usuario : "",
    password: isEdit ? admin.password : "",
    rol: 2,
    fechaAlta: isEdit ? admin.fecha_Alta : fechaFormateada,
    activo: isEdit ? admin.activo : "",
  });

  const [currentFieldName, setCurrentFieldName] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const dataCountrys = await getCountrys(token);
      setCountrysOptions(dataCountrys);

      if (dataPerson.country) {
        const dataStates = await getStates(dataPerson.country, token);
        setStatesOptions(dataStates);
      }
      if (dataPerson.state) {
        const dataCantones = await getCantones(dataPerson.state, token);
        setCantonesOptions(dataCantones);
      }
      if (dataPerson.canton) {
        const dataDistrict = await getDistricts(dataPerson.canton, token);
        setDistrictOptions(dataDistrict);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }, [dataPerson.country, dataPerson.state, dataPerson.canton, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChangePerson = (e) => {
    const { value } = e.target;
    if (currentFieldName) {
      setDataPerson((prevState) => ({
        ...prevState,
        [currentFieldName]: value,
      }));
    }
  };

  const handleChangeUser = (event) => {
    const { value } = event.target;
    if (currentFieldName) {
      setUsuario((prevState) => ({
        ...prevState,
        [currentFieldName]: value,
      }));
    }
  };

  const handleFocus = (fieldName) => {
    setCurrentFieldName(fieldName);
  };

  const handleAdd = async () => {
    try {
      const result = await PersonaController.InsertPerson(dataPerson, token);
      if (result.id) {
        const newUser = await UsuarioController.InsertUser(
          usuario,
          result.id,
          token
        );
        handleClose();
      }
    } catch (error) {
      console.error("Error al insertar la persona:", error);
    }
  };

  const handleEdit = async () => {
    try {
      const result = await PersonaController.UpdatePerson(
        dataPerson,
        admin.id,
        token
      );
      handleClose();
    } catch (error) {
      console.error("Error al modificar la persona:", error);
    }
  };

  return (
    <div className="container-modal">
      <h2>{isEdit ? "Editar administrador" : "Agregar un administrador"}</h2>

      <Box
        component="form"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          "& > div": { width: "48%" },
          "& .MuiTextField-root": { m: 0.5, width: "100%" },
          "& .MuiFormControl-root": { m: 0.5, width: "100%" },
        }}
        noValidate
        autoComplete="off"
      >
        <div>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextField
              id="mail"
              label="Correo electronico"
              onFocus={() => handleFocus("mail")}
              onChange={handleChangePerson}
              value={dataPerson.mail || ""}
            />

            <TextField
              id="firstName"
              label="Primer nombre"
              onFocus={() => handleFocus("firstName")}
              onChange={handleChangePerson}
              value={dataPerson.firstName || ""}
            />

            <TextField
              id="secondName"
              label="Segundo nombre"
              onFocus={() => handleFocus("secondName")}
              onChange={handleChangePerson}
              value={dataPerson.secondName || ""}
            />
            <TextField
              id="firstLastName"
              label="Primer apellido"
              onFocus={() => handleFocus("firstLastName")}
              onChange={handleChangePerson}
              value={dataPerson.firstLastName || ""}
            />
            <TextField
              id="secondLastName"
              label="Segundo apellido"
              onFocus={() => handleFocus("secondLastName")}
              onChange={handleChangePerson}
              value={dataPerson.secondLastName || ""}
            />
            <TextField
              id="cellphoneNumber"
              label="Numero de celular"
              onFocus={() => handleFocus("cellphoneNumber")}
              onChange={handleChangePerson}
              value={dataPerson.cellphoneNumber || ""}
            />

            <Autocomplete
              value={
                optionsIdentify.find(
                  (option) => option.id === dataPerson.typeIdentify
                ) || null
              }
              onChange={(event, value) => {
                const selectedIdentify = optionsIdentify.find(
                  (identify) => identify.id === value?.id
                );
                setDataPerson({
                  ...dataPerson,
                  typeIdentify: selectedIdentify ? selectedIdentify.id : "",
                });
              }}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              options={optionsIdentify}
              getOptionLabel={(option) => option.nombre || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tipo de identificacion"
                  sx={{ m: 1, minWidth: 200 }}
                />
              )}
            />

            <TextField
              id="numberIdentify"
              label="Numero de identificacion"
              onFocus={() => handleFocus("numberIdentify")}
              onChange={handleChangePerson}
              value={dataPerson.numberIdentify || ""}
            />

            <Autocomplete
              value={
                countrysOptions.find(
                  (option) => option.id === dataPerson.country
                ) || null
              }
              onChange={(event, value) => {
                const selectedCountry = countrysOptions.find(
                  (country) => country.id === value?.id
                );
                setDataPerson({
                  ...dataPerson,
                  country: selectedCountry ? selectedCountry.id : "",
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
          </Box>
        </div>
        <div>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Autocomplete
              value={
                statesOptions.find(
                  (option) => option.id === dataPerson.state
                ) || null
              }
              onChange={(event, value) => {
                const selectedState = statesOptions.find(
                  (state) => state.id === value?.id
                );
                setDataPerson({
                  ...dataPerson,
                  state: selectedState ? selectedState.id : "",
                });
              }}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              options={statesOptions}
              getOptionLabel={(option) => option.nombre || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Estado o Provincia"
                  sx={{ m: 1, minWidth: 200 }}
                />
              )}
            />
            <Autocomplete
              value={
                cantonesOptions.find(
                  (option) => option.id === dataPerson.canton
                ) || null
              }
              onChange={(event, value) => {
                const selectedCanton = cantonesOptions.find(
                  (canton) => canton.id === value?.id
                );
                setDataPerson({
                  ...dataPerson,
                  canton: selectedCanton ? selectedCanton.id : "",
                });
              }}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              options={cantonesOptions}
              getOptionLabel={(option) => option.nombre || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Canton"
                  sx={{ m: 1, minWidth: 200 }}
                />
              )}
            />

            <Autocomplete
              value={
                districtOptions.find(
                  (option) => option.id === dataPerson.district
                ) || null
              }
              onChange={(event, value) => {
                const selectedDistrict = districtOptions.find(
                  (district) => district.id === value?.id
                );
                setDataPerson({
                  ...dataPerson,
                  district: selectedDistrict ? selectedDistrict.id : "",
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
              id="city"
              label="Ciudad"
              onFocus={() => handleFocus("city")}
              onChange={handleChangePerson}
              value={dataPerson.city}
            />

            <TextField
              id="direction"
              label="Direccion exacta"
              onFocus={() => handleFocus("direction")}
              onChange={handleChangePerson}
              value={dataPerson.direction}
            />
            <TextField
              id="postalMail"
              label="Apartado postal"
              onFocus={() => handleFocus("postalMail")}
              onChange={handleChangePerson}
              value={dataPerson.postalMail}
            />

            <TextField
              id="userName"
              label="Nombre Usuario"
              onFocus={() => handleFocus("nombreUsuario")}
              onChange={handleChangeUser}
              value={usuario.nombreUsuario}
            />
            <TextField
              id="password"
              label="Contraseña"
              onFocus={() => handleFocus("password")}
              onChange={handleChangeUser}
              value={usuario.password}
            />

            <Autocomplete
              value={
                optionsActive.find(
                  (option) => option.value === usuario.activo
                ) || null
              }
              onChange={(event, value) => {
                const selectedActive = optionsActive.find(
                  (active) => active.value === value?.value
                );
                setUsuario({
                  ...usuario,
                  activo: selectedActive ? selectedActive.value : "",
                });
              }}
              isOptionEqualToValue={(option, value) =>
                option.value === value?.value
              }
              options={optionsActive}
              getOptionLabel={(option) => option.label || ""}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Activo"
                  sx={{ m: 1, minWidth: 200 }}
                />
              )}
            />

            <div className="button-container">
              <Button sx={{ mt: 2 }} onClick={isEdit ? handleEdit : handleAdd}>
                {isEdit ? "Editar" : "Crear"}
              </Button>

              <Button sx={{ mt: 2 }} color="error" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </Box>
        </div>
      </Box>
    </div>
  );
};

export default ModalAdmin;
