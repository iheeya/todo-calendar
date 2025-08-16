import { useState } from "react";
import Calendar from "./calendar/index";
import { Grid, Box } from "@mui/material";

function App() {
  return (
    <div className="mx-5 mt-15">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Calendar />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
