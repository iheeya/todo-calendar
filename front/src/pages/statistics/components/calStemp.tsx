import { getCalStemp } from "../../../shared/api/statisticAPI";
import { useEffect, useState } from "react";
import { Paper, Avatar, Typography, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface CalStempData {
  id: number;
  date: string;
  good: boolean;
}

export default function CalStemp() {
  const [data, setData] = useState<CalStempData[]>([]);
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // 이번달 일수

  useEffect(() => {
    const fetchCalStemp = async () => {
      try {
        const data = await getCalStemp();
        console.log("CalStemp data:", data);
        setData(data);
      } catch (error) {
        console.error("Failed to fetch CalStemp data:", error);
      }
    };
    fetchCalStemp();
    console.log(daysInMonth);
  }, []);

  const extractDayFromDate = (dateString: string): number => {
    const date = new Date(dateString);
    return date.getDate(); // 1~31 반환
  };
  return (
    <Box
      sx={{
        display: "Grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 2,
        mt: 3,
      }}
    >
      {Array.from({ length: daysInMonth }, (_, index) => {
        const dayNumber = index + 1;
        // 해당 날짜와 일치하는 데이터 찾기
        const dayData = data.filter(
          (d) => extractDayFromDate(d.date) === dayNumber
        );

        return (
          <Paper variant="elevation" key={index} sx={{ p: 1, minHeight: 60 }}>
            <Typography variant="caption">{dayNumber}</Typography>

            {/* 해당 날짜의 데이터들로 Avatar 생성 */}
            {dayData.map((d) => (
              <Avatar
                key={d.id}
                sx={{ bgcolor: d.good ? "blue" : "red", width: 20, height: 20 }}
              >
                {d.good ? (
                  <CheckIcon fontSize="small" />
                ) : (
                  <CloseIcon fontSize="small" />
                )}
              </Avatar>
            ))}
          </Paper>
        );
      })}
    </Box>
  );
}
