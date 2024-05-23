import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

function CustomMenu() {
  const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar la apertura del menú
  const { isAdmin, isInvited, isPrincipal } = useContext(AuthContext);

  // Función para manejar el clic en el botón de menú
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Función para cerrar el menú
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Define los elementos del menú
  const menuItems = [
    {
      label: "Inicio",
      to: "/",
    },
    ...(isPrincipal
      ? [
          {
            label: "Administradores",
            to: "/Admins",
          },
          {
            label: "Espacios",
            to: "/SpaceTable",
          },
          {
            label: "Periodos",
            to: "/PeriodTable",
          },
          {
            label: "Cursos",
            to: "/CursoTable",
          },
          {
            label: "Asignar clases",
            to: "/ViewAsigClasesProfesor",
          },
          {
            label: "Cámaras",
            to: "/ViewAddCamera",
          },
        ]
      : []),
    ...(isPrincipal || isAdmin
      ? [
          {
            label: "Alumnos",
            to: "/StudentTable",
          },
          {
            label: "Historial de datos",
            to: "/ViewDataHistoryClass",
          },
          {
            label: "Lista de alumnos",
            to: "/ViewClassList",
          },
          {
            label: "Invitados",
            to: "/Guests",
          },
        ]
      : []),
    ...(isInvited
      ? [
          {
            label: "Historial de datos",
            to: "/ViewDataHistoryClass",
          },
        ]
      : []),
    {
      label: "Cerrar sesión",
      to: "/Login",
    },
  ];

  return (
    <div>
      {/* Botón de menú */}
      <Button
        id="fade-button"
        aria-controls={anchorEl ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={anchorEl ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuIcon className="menuIcon" />
      </Button>

      {/* Menú desplegable */}
      <Menu
        id="fade-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {menuItems.map((item, index) => (
          <MenuItem key={index} onClick={handleClose}>
            <Link
              to={item.to}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {item.label}
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default CustomMenu;
