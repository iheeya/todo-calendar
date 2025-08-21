import Rating from "./components/rating";
import CalStemp from "./components/calStemp";
import { Box } from "@mui/material";

export default function Statistics() {
  return (
    <Box className="mx-auto mt-5" sx={{ width: "80%" }}>
      <Rating />
      <CalStemp />
    </Box>
  );
}
