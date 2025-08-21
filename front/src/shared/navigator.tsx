import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { AutoGraphOutlined, EditNoteOutlined } from "@mui/icons-material";

export default function Navigator() {
  const [value, setValue] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setValue(0);
    } else if (location.pathname === "/statistics") {
      setValue(1);
    }
  }, [location.pathname]);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const goToSchedule = () => {
    navigate("/");
    setValue(0);
  };

  const goToStatistics = () => {
    navigate("/statistics");
    setValue(1);
  };

  return (
    <Box sx={{ marginTop: 6, width: "100%" }}>
      <BottomNavigation showLabels value={value} onChange={handleChange}>
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
