import { getRating } from "../../../shared/api/statisticAPI";
import { useEffect, useState } from "react";
import { LinearProgress, Box, Typography } from "@mui/material";

export default function Rating() {
  const [rateData, setRateData] = useState<number>(0); // 최종 값
  const [displayRate, setDisplayRate] = useState<number>(0); // 애니메이션 값

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const data = await getRating(); // 예: 73
        setRateData(data);
      } catch (error) {
        console.error("Failed to fetch rating:", error);
      }
    };
    fetchRating();
  }, []);

  // displayRate를 0부터 rateData까지 애니메이션으로 증가
  useEffect(() => {
    if (rateData > 0) {
      let current = 0;
      const step = Math.ceil(rateData / 50); // 증가 폭 저장
      const timer = setInterval(() => {
        current += step;
        if (current >= rateData) {
          current = rateData;
          clearInterval(timer);
        }
        setDisplayRate(current);
      }, 20); 

      return () => clearInterval(timer);
    }
  }, [rateData]);

  return (
    <Box className="mx-auto mt-5" sx={{ width: "80%" }}>
      <Typography variant="h6" gutterBottom>
        오늘의 목표 달성률
      </Typography>

      {/* 퍼센트 바 */}
      <Box display="flex" alignItems="center" gap={2}>
        <Box sx={{ flexGrow: 1 }}>
          <LinearProgress
            variant="determinate"
            value={displayRate}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
        <Typography variant="body1" fontWeight="bold">
          {displayRate}%
        </Typography>
      </Box>
    </Box>
  );
}
