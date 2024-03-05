import React from "react";
import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import CustomMenu from "./CustomMenu";

function Header() {
  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Typography variant="h6">Mi Aplicación</Typography>
        <Box sx={{ flexGrow: 1 }} />
        <CustomMenu />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
