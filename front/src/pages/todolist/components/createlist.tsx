import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  TextField,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import { useState } from "react";

interface CreateListProps {
  open: boolean;
  onClose: () => void;
  onCreateClick: () => void;
}

export default function CreateList({
  onCreateClick,
  onClose,
  open,
}: CreateListProps) {
  const [taskContent, setTaskContent] = useState<string>("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // 여기에 API 호출 로직을 추가하여 새로운 할 일을 서버에 저장
    console.log("새 할 일 내용:", taskContent);
    setTaskContent(""); // 입력 필드 초기화
    onClose(); // 다이얼로그 닫기
  };

  return (
    <>
      <IconButton aria-label="create-list" onClick={onCreateClick}>
        <CreateIcon />
      </IconButton>

      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>할 일 추가</DialogTitle>
        <DialogContent>할 일을 입력하세요</DialogContent>
        <form onSubmit={handleSubmit} id="create-task-form">
          <TextField
            id="task-content"
            label="할 일 내용"
            type="text"
            variant="standard"
            sx={{ mx: 2, width: "80%" }} // 좌우 마진(margin-left/right) 추가
            onChange={(e) => setTaskContent(e.target.value)}
          />
        </form>

        <DialogActions>
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" form="create-task-form">
            저장
          </Button>
          {/* 저장할때는 API 형식 맞춰서 데이터 전송
          엔터 입력해도 전송되도록*/}
        </DialogActions>
      </Dialog>
    </>
  );
}
