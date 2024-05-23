import { BACKEND } from "./Backend";

export const getCountrys = async (token) => {
  try {
    const response = await fetch(`${BACKEND}Ubicacion/ExtraerPaises`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los países");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    return null;
  }
};

export const getStates = async (countryId, token) => {
  try {
    const response = await fetch(
      `${BACKEND}Ubicacion/ExtraerEstado_Provincias?id=${countryId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error al obtener los estados o provincias");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    return null;
  }
};

export const getCantones = async (stateId, token) => {
  try {
    const response = await fetch(
      `${BACKEND}Ubicacion/ExtraerCantones?id=${stateId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error al obtener los cantones");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    return null;
  }
};

export const getDistricts = async (cantonId, token) => {
  try {
    const response = await fetch(
      `${BACKEND}Ubicacion/ExtraerDistritos?id=${cantonId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      throw new Error("Error al obtener los distritos");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    // Manejar el error, por ejemplo, mostrar un mensaje al usuario
    return null;
  }
};
