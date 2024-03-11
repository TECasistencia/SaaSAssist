import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";

function Footer() {
  return (
    <div>
      <AppBar position="static" color="primary">
        <Toolbar style={{ justifyContent: "center" }}>
          <Typography variant="body1" color="inherit">
            Derechos de autor © 2024
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Footer;
