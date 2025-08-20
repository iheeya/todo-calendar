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
import { PostTodo } from "../../../shared/api/todolistAPI";

interface CreateListProps {
  open: boolean;
  onClose: () => void;
  onCreateClick: () => void;
  onAdd: (todo: { id: number; content: string; is_done: boolean }) => void;
}

export default function CreateList({
  onCreateClick,
  onClose,
  open,
  onAdd,
}: CreateListProps) {
  const [taskContent, setTaskContent] = useState<string>("");
  const isDone = false;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("submit!");
    console.log(taskContent, isDone);
    try {
      const newTodo = await PostTodo({
        content: taskContent,
        is_done: isDone,
      });

      onAdd(newTodo);
      setTaskContent(""); // 입력 필드 초기화
    } catch (error) {
      console.error("Error creating todo:", error);
    }

    onClose(); // 다이얼로그 닫기
  };

  return (
    <>
      <IconButton aria-label="create-list" onClick={onCreateClick}>
        <CreateIcon />
      </IconButton>

      <Dialog open={open} onClose={onClose} fullWidth>
        <form onSubmit={handleSubmit} id="create-task-form">
          <DialogTitle>할 일 추가</DialogTitle>
          <DialogContent>
            할 일을 입력하세요
            <TextField
              id="task-content"
              label="할 일 내용"
              type="text"
              variant="standard"
              sx={{ mx: 2, width: "80%" }} // 좌우 마진(margin-left/right) 추가
              onChange={(e) => setTaskContent(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>취소</Button>
            <Button type="submit" form="create-task-form">
              저장
            </Button>
            {/* 저장할때는 API 형식 맞춰서 데이터 전송
          엔터 입력해도 전송되도록*/}
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
