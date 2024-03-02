import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

function Footer() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography variant="body1" color="inherit">
          Derechos de autor © 2024
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
