import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";

function CustomMenu() {
  const [anchorEl, setAnchorEl] = useState(null); // Estado para controlar la apertura del menú

  // Función para manejar el clic en el botón de menú
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Función para cerrar el menú
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <MenuItem onClick={handleClose}>
          <Link
            to="/Inicio"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Inicio
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            to="/Admins"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Administradores
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            to="/ViewDataHistoryClass"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Historial de datos
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            to="/Guests"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Invitados
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link
            to="/Users"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Usuarios
          </Link>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Log out
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default CustomMenu;
