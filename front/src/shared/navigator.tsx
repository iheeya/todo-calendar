import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { AutoGraphOutlined, EditNoteOutlined } from "@mui/icons-material";

export default function Navigator() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const goToSchedule = () => {
    navigate("/");
  };

  const goToStatistics = () => {
    navigate("/statistics");
  };

  return (
    <Box sx={{ marginTop: 6, width: "100%" }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Schedule"
          icon={<EditNoteOutlined />}
          onClick={goToSchedule}
        />
        <BottomNavigationAction
          label="Statistics"
          icon={<AutoGraphOutlined />}
          onClick={goToStatistics}
        />
      </BottomNavigation>
    </Box>
  );
}
