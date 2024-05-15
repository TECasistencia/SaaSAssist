import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  TextField,
  Tooltip,
  Autocomplete,
} from "@mui/material";
import { AuthContext } from "../contexts/AuthContext";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";
import React, { useState, useEffect, useContext } from "react";

import PersonaController from "../serviceApi/personaController";
import {
  getCountrys,
  getStates,
  getCantones,
  getDistricts,
} from "../serviceApi/ubicacionController";

import UsuarioController from "../serviceApi/usuarioController";

const ModalAdmin = ({ isEdit, admin, handleClose }) => {
  const { dataUser, token } = useContext(AuthContext);
  const [statesOptions, setStatesOptions] = useState();
  const [countrysOptions, setCountrysOptions] = useState();
  const [cantonesOptions, setCantonesOptions] = useState();
  const [districtOptions, setDistrictOptions] = useState();

  const optionsActive = [
    { label: "Sí", value: true },
    { label: "No", value: false },
  ];
  const optionsIdentify = [
    { id: 1, nombre: "Cedula de identidad" },
    { id: 2, nombre: "Carnet de Extranjería" },
    { id: 3, nombre: "Pasaporte" },
  ];

  const [resultPerson, setResultPerson] = useState("");

  // Obtener la fecha actual en formato ISO (YYYY-MM-DD HH:mm:ss.sssZ)
  const fechaActual = new Date();
  const fechaFormateada = fechaActual.toLocaleDateString("en-CA"); // 'en-CA' representa el formato 'yyyy-mm-dd'

  const [dataPerson, setDataPerson] = useState({
    mail: isEdit ? admin.correo_Electronico : null,
    typeIdentify: isEdit
      ? optionsIdentify.find(
          (option) => option.id === admin.tipo_Identificacion
        )?.nombre
      : null,
    country: null,
    state: null,
    canton: null,
    district: null,
    firstName: isEdit ? admin.primer_Nombre : null,
    secondName: isEdit ? admin.segundo_Nombre : null,
    cellphoneNumber: isEdit ? admin.telefono : null,
    firstLastName: isEdit ? admin.primer_Apellido : null,
    secondLastName: isEdit ? admin.segundo_Apellido : null,
    numberIdentify: isEdit ? admin.numero_Identificacion : null,
    city: isEdit ? admin.ciudad : null,
    direction: isEdit ? admin.direccion : null,
    postalMail: isEdit ? admin.apartado_Postal : null,
  });

  const obtenerCountrys = async (token) => {
    try {
      const dataCountrys = await getCountrys(token);
      setCountrysOptions(dataCountrys);
    } catch (error) {
      console.error("Error al obtener los países:", error);
    }
  };

  const obtenerStates = async (countryId, token) => {
    try {
      const dataStates = await getStates(countryId, token);
      setStatesOptions(dataStates);
    } catch (error) {
      console.error("Error al obtener los estados o provincias:", error);
    }
  };

  const obtenerCantones = async (stateId, token) => {
    try {
      const dataCantones = await getCantones(stateId, token);
      setCantonesOptions(dataCantones);
    } catch (error) {
      console.error("Error al obtener los cantones:", error);
    }
  };

  const obtenerDistritos = async (cantonId, token) => {
    try {
      const dataDistrict = await getDistricts(cantonId, token);
      setDistrictOptions(dataDistrict);
    } catch (error) {
      console.error("Error al obtener los distritos:", error);
    }
  };

  useEffect(() => {
    obtenerCountrys(token);

    if (dataPerson.country) {
      obtenerStates(dataPerson.country, token);
    }
    if (dataPerson.state) {
      obtenerCantones(dataPerson.state, token);
    }
    if (dataPerson.canton) {
      obtenerDistritos(dataPerson.canton, token);
    }
    if (resultPerson !== "") {
      handleAddUser();
    }
  }, [
    dataPerson.country,
    dataPerson.state,
    dataPerson.canton,
    resultPerson,
    token,
  ]);

  const [usuario, setUsuario] = useState({
    idPersona: isEdit ? admin.id : resultPerson,
    idOrganizacion: parseInt(dataUser.IdOrganizacion),
    nombreUsuario: isEdit ? admin.nombre_Usuario : null,
    password: isEdit ? admin.password : null,
    rol: 2,
    fechaAlta: isEdit ? admin.fecha_Alta : fechaFormateada, // No estoy seguro de dónde obtienes esta fecha, así que la dejé como en tu código original
    activo: isEdit
      ? optionsActive.find((option) => option.value === admin.activo)?.label
      : null,
  });

  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [selectedStateName, setSelectedStateName] = useState("");
  const [selectedCantonName, setSelectedCantonName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedIdentifyName, setSelectedIdentifyName] = useState("");
  const [selectedActiveName, setSelectedActiveName] = useState("");
  const [currentFieldName, setCurrentFieldName] = useState("");

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

  const handleChangePerson = (e) => {
    const { name, value } = e.target;
    if (currentFieldName) {
      setDataPerson((prevState) => ({
        ...prevState,
        [currentFieldName]: value,
      }));
    }
  };

  const handleChangeUser = (event) => {
    const { name, value } = event.target;
    if (currentFieldName) {
      setUsuario({
        ...usuario,
        [currentFieldName]: value,
      });
    }
  };

  const handleFocus = (fieldName) => {
    setCurrentFieldName(fieldName);
  };

  const handleChangeImages = (e) => {
    const inputValue = e.target.value;
    setImages(inputValue);
  };

  const handleAdd = async () => {
    try {
      // Llamar a la función InsertPerson del controlador PersonaController
      const result = await PersonaController.InsertPerson(dataPerson, token);
      setResultPerson(result.id);

      // Aquí puedes hacer algo después de insertar la persona, como cerrar el modal
    } catch (error) {
      console.error("Error al insertar la persona:", error);
      // Aquí puedes manejar el error de alguna manera, como mostrando un mensaje al usuario
    }
  };

  const handleAddUser = async () => {
    try {
      // Asegúrate de que resultPerson tenga un valor antes de intentar agregar el usuario
      if (resultPerson) {
        // Actualiza el estado del usuario con el nuevo ID de persona
        setUsuario((prevUsuario) => ({
          ...prevUsuario,
          idPersona: resultPerson,
        }));

        // Llamar a la función InsertarUsuario del controlador de usuario
        const newUser = await UsuarioController.InsertarUsuario(usuario, token);
        console.log("Nuevo usuario agregado:", newUser);
      } else {
        console.warn("El ID de persona es nulo o vacío.");
      }
    } catch (error) {
      console.error("Error al agregar el usuario:", error);
      // Manejar el error
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
          flexDirection: "row", // Establece la dirección de los elementos en fila
          flexWrap: "wrap", // Permite que los elementos se envuelvan a la siguiente línea si no caben en el ancho del contenedor
          justifyContent: "space-between",
          // Distribuye los elementos de manera uniforme a lo largo del contenedor
          "& > div": { width: "48%" }, // Establece el ancho de cada columna

          "& .MuiTextField-root": { m: 0.5, width: "100%" }, // Ancho completo para TextField
          "& .MuiFormControl-root": { m: 0.5, width: "100%" }, // Ancho completo para FormControl
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
              value={selectedIdentifyName || dataPerson.typeIdentify} // Utilizamos la variable temporal para el nombre
              onChange={(event, value) => {
                const selectedIdentify = optionsIdentify.find(
                  (identify) => identify.nombre === value
                );
                if (selectedIdentify) {
                  setSelectedIdentifyName(selectedIdentify.nombre); // Almacenamos el nombre
                  setDataPerson({
                    ...dataPerson,
                    typeIdentify: selectedIdentify.id, // Almacenamos el ID
                  });
                }
              }}
              options={
                optionsIdentify
                  ? optionsIdentify.map((option) => option.nombre)
                  : []
              }
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
              value={selectedCountryName} // Utilizamos la variable temporal para el nombre
              onChange={(event, value) => {
                const selectedCountry = countrysOptions.find(
                  (country) => country.nombre === value
                );
                if (selectedCountry) {
                  setSelectedCountryName(selectedCountry.nombre); // Almacenamos el nombre
                  setDataPerson({
                    ...dataPerson,
                    country: selectedCountry.id, // Almacenamos el ID
                  });
                }
              }}
              options={
                countrysOptions
                  ? countrysOptions.map((option) => option.nombre)
                  : []
              }
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
              value={selectedStateName} // Utilizamos la variable temporal para el nombre
              onChange={(event, value) => {
                const selectedState = statesOptions.find(
                  (state) => state.nombre === value
                );
                if (selectedState) {
                  setSelectedStateName(selectedState.nombre); // Almacenamos el nombre
                  setDataPerson({
                    ...dataPerson,
                    state: selectedState.id, // Almacenamos el ID
                  });
                }
              }}
              options={
                statesOptions
                  ? statesOptions.map((option) => option.nombre)
                  : []
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Estado o Provincia"
                  sx={{ m: 1, minWidth: 200 }}
                />
              )}
            />
            <Autocomplete
              value={selectedCantonName} // Utilizamos la variable temporal para el nombre
              onChange={(event, value) => {
                const selectedCanton = cantonesOptions.find(
                  (canton) => canton.nombre === value
                );
                if (selectedCanton) {
                  setSelectedCantonName(selectedCanton.nombre); // Almacenamos el nombre
                  setDataPerson({
                    ...dataPerson,
                    canton: selectedCanton.id, // Almacenamos el ID
                  });
                }
              }}
              options={
                cantonesOptions
                  ? cantonesOptions.map((option) => option.nombre)
                  : []
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Canton"
                  sx={{ m: 1, minWidth: 200 }}
                />
              )}
            />

            <Autocomplete
              value={selectedDistrictName} // Utilizamos la variable temporal para el nombre
              onChange={(event, value) => {
                const selectedDistrict = districtOptions.find(
                  (district) => district.nombre === value
                );
                if (selectedDistrict) {
                  setSelectedDistrictName(selectedDistrict.nombre); // Almacenamos el nombre
                  setDataPerson({
                    ...dataPerson,
                    district: selectedDistrict.id, // Almacenamos el ID
                  });
                }
              }}
              options={
                districtOptions
                  ? districtOptions.map((option) => option.nombre)
                  : []
              }
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
              value={selectedActiveName || usuario.activo} // Utilizamos la variable temporal para el nombre
              onChange={(event, value) => {
                const selectedActiveName = optionsActive.find(
                  (active) => active.label === value
                );
                if (selectedActiveName) {
                  setSelectedActiveName(selectedActiveName.label); // Almacenamos el nombre
                  setUsuario({
                    ...usuario,
                    activo: selectedActiveName.value,
                  });
                }
              }}
              options={
                optionsActive ? optionsActive.map((option) => option.label) : []
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Activo"
                  sx={{ m: 1, minWidth: 200 }}
                />
              )}
            />

            <div className="button-container">
              <Button sx={{ mt: 2 }} onClick={handleAdd}>
                {isEdit ? "Editar" : "Crear"}
              </Button>
              <Button sx={{ mt: 2 }} color="error" onClick={handleClose}>
                Cancelar
              </Button>
            </div>
          </Box>
        </div>
        {/*  
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
          */}
      </Box>
      {/*
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
              */}
    </div>
  );
};

export default ModalAdmin;
