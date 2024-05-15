import { BACKEND } from "../serviceApi/backend";

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
      return data;
    } catch (error) {
      console.error("Error al insertar la persona:", error);
      throw error;
    }
  },
};

export default PersonaController;
