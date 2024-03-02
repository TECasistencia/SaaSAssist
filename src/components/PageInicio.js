import * as React from "react";
import Header from "./Header";
import Menu from "./Menu";
import Footer from "./Footer";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CameraCard from "./CameraCard";

function PageInicio() {
  return (
    <div>
      <Header />
      <Menu />
      <Box sx={{ flexGrow: 1 }} className="box">
        <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={2}>
            <CameraCard />
          </Grid>
          <Grid item xs={2}>
            <CameraCard />
          </Grid>
          <Grid item xs={2}>
            <CameraCard />
          </Grid>
        </Grid>
        <Footer />
      </Box>
    </div>
  );
}

export default PageInicio;
