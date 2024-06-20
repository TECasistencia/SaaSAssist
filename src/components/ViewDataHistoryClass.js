import React, { useState } from "react";
import { Link } from "react-router-dom"; // Importa Link de React Router
import Header from "./Header";
import Footer from "./Footer";
import { TextField, Button, List, ListItem, Box } from "@mui/material";
import "../styles/styleViewDataHistoryClass.css";

function ViewDataHistoryClass() {
  const [searchQuery, setSearchQuery] = useState(""); // Estado para almacenar la consulta de búsqueda
  const [filteredData, setFilteredData] = useState([]); // Estado para almacenar los datos filtrados

  // Datos de ejemplo: aulas
  const classrooms = [
    { id: 1, name: "Inteligencia Artifial" },
    { id: 2, name: "Taller de programación" },
    { id: 3, name: "Bases de datos 1" },
  ];

  // Función para manejar cambios en la consulta de búsqueda
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Función para filtrar los datos por aula
  const handleSearch = () => {
    // Filtrar los datos basados en la consulta de búsqueda
    const filteredClassrooms = classrooms.filter((classroom) =>
      classroom.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Actualizar los datos filtrados
    setFilteredData(filteredClassrooms);
  };

  return (
    <div className="contentClass">
      <Header />
      <div className="contentInternClass">
        <Box className="search-container">
          {/* Barra de búsqueda por aula */}
          <TextField
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por Curso..."
            variant="outlined"
            className="search-input"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            className="search-button"
          >
            Buscar
          </Button>
        </Box>
        {/* Título "Aulas" */}
        <h2 className="header-text">Cursos:</h2>
        {/* Lista de aulas */}
        <div className="list-container">
          <List className="list">
            {(searchQuery ? filteredData : classrooms).map((classroom) => (
              <ListItem className="list-item" key={classroom.id}>
                {/* Cambiar el enlace por un botón */}
                <Link
                  to={`/ViewDataHistoryDate/${classroom.id}`} // Ruta con el ID del aula
                  state={{ className: classroom.name }}
                  className="button-link"
                >
                  <Button variant="contained">{classroom.name}</Button>
                </Link>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ViewDataHistoryClass;
