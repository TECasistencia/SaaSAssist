import * as React from "react";
import Header from "./components/Header";
import Menu from "./components/Menu";
import Footer from "./components/Footer";
import CameraCard from "./components/CameraCard";
import { Container, Grid } from "@material-ui/core";

function Page_inicio() {
  return (
    <div>
      <Header />
      <Menu />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <CameraCard />
          </Grid>
          {/* Repite este Grid para cada cámara */}
        </Grid>
      </Container>
      <Footer />
    </div>
  );
}

export default Page_inicio;
