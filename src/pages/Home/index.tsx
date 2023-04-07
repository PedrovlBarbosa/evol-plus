import React from "react";
import CameraComponent from "../../components/CameraComponent";
import { Grid } from "@mui/material";

function Home() {
  return (
    <>
      <Grid container alignItems="center" justifyItems="center">
        <Grid item xs={12}>
          <CameraComponent></CameraComponent>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;
