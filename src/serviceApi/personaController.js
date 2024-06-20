import { BACKEND } from "./Backend";

const PersonaController = {
  InsertPerson: async (person, token) => {
    try {
      const response = await fetch(BACKEND + "Persona/Insertar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          PrimerNombre: person.firstName,
          SegundoNombre: person.secondName,
          PrimerApellido: person.firstLastName,
          SegundoApellido: person.secondLastName,
          TipoIdentificacion: person.typeIdentify,
          NumeroIdentificacion: person.numberIdentify,
          IdPais: person.country,
          IdEstadoProvincia: person.state,
          IdCanton: person.canton,
          IdDistrito: person.district,
          Ciudad: person.city,
          Direccion: person.direction,
          ApartadoPostal: person.postalMail,
          Telefono: person.cellphoneNumber,
          CorreoElectronico: person.mail,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al insertar la persona");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al insertar la persona:", error);
      throw error;
    }
  },

  UpdatePerson: async (person, id, token) => {
    try {
      const response = await fetch(BACKEND + "Persona/Modificar", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          Id: id,
          PrimerNombre: person.firstName,
          SegundoNombre: person.secondName,
          PrimerApellido: person.firstLastName,
          SegundoApellido: person.secondLastName,
          TipoIdentificacion: person.typeIdentify,
          NumeroIdentificacion: person.numberIdentify,
          IdPais: person.country,
          IdEstadoProvincia: person.state,
          IdCanton: person.canton,
          IdDistrito: person.district,
          Ciudad: person.city,
          Direccion: person.direction,
          ApartadoPostal: person.postalMail,
          Telefono: person.cellphoneNumber,
          CorreoElectronico: person.mail,
        }),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Error al modificar la persona");
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
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Error al eliminar la persona");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al eliminar la persona:", error);
      throw error;
    }
  },

  GetPersonByUsername: async (username, token) => {
    try {
      const response = await fetch(
        `${BACKEND}Persona/BuscarPorNombreUsuario?nombreUsuario=${username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al buscar la persona por nombre de usuario");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al buscar la persona por nombre de usuario:", error);
      throw error;
    }
  },
};

export default PersonaController;
