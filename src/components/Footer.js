import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import "./styles/styleInicio.css";

function Footer() {
  return (
    <div className="footer">
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="body1" color="inherit">
            Derechos de autor © 2024
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Footer;
