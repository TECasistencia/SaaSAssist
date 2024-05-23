import { BACKEND } from "./Backend";

const PersonaController = {
  InsertPerson: async (person, token) => {
    try {
      console.log(person);
      const response = await fetch(BACKEND + "Persona/Insertar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          primerNombre: person.firstName,
          segundoNombre: person.secondName,
          primerApellido: person.firstLastName,
          segundoApellido: person.secondLastName,
          tipoIdentificacion: person.typeIdentify,
          numeroIdentificacion: person.numberIdentify,
          idPais: person.country,
          idEstadoProvincia: person.state,
          idCanton: person.canton,
          idDistrito: person.district,
          ciudad: person.city,
          direccion: person.direction,
          apartadoPostal: person.postalMail,
          telefono: person.cellphoneNumber,
          correoElectronico: person.mail,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al insertar la persona");
      }

      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error al insertar la persona:", error);
      throw error;
    }
  },

  UpdatePerson: async (person, id, token) => {
    try {
      const response = await fetch(BACKEND + "Persona/Modificar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id: id,
          primerNombre: person.firstName,
          segundoNombre: person.secondName,
          primerApellido: person.firstLastName,
          segundoApellido: person.secondLastName,
          tipoIdentificacion: person.typeIdentify,
          numeroIdentificacion: person.numberIdentify,
          idPais: person.country,
          idEstadoProvincia: person.state,
          idCanton: person.canton,
          idDistrito: person.district,
          ciudad: person.city,
          direccion: person.direction,
          apartadoPostal: person.postalMail,
          telefono: person.cellphoneNumber,
          correoElectronico: person.mail,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al modificar la persona");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al modificar la persona:", error);
      throw error;
    }
  },
  DeletePerson: async (id, token) => {
    try {
      const response = await fetch(BACKEND + "Persona/Eliminar?id=" + id, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la persona");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al eliminar la persona:", error);
      throw error;
    }
  },
};

export default PersonaController;
