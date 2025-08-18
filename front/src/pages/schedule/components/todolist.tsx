import { useEffect, useState } from "react";
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Paper,
  Stack,
  Pagination,
} from "@mui/material";

interface Task {
  id: number;
  content: string;
  is_done: boolean;
}

const pageSize = 8;

export default function TodoList() {
  const [tastks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    fetch("/mock/todolist/todoGet.json")
      .then((response) => response.json())
      .then((data) => {
        // console.log("Todo List Data:", data.tasks);
        setTasks(data.tasks);
      })
      .catch((error) => {
        console.error("Error fetching todo list:", error);
      });
  }, []);

  const handleCheckboxChange = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, is_done: !task.is_done } : task
      )
    );
  };

  const pageCount = Math.ceil(tastks.length / pageSize);
  const pageTasks = tastks.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <h1 className="text-center text-xl">Todo List</h1>
      <Paper
        style={{
          padding: "5%",
          marginTop: "4%",
          width: "100%",
          minHeight: "90%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="flex-1">
          {pageTasks.map((task) => (
            <FormGroup key={task.id}>
              <FormControlLabel
                control={<Checkbox checked={task.is_done} />}
                label={task.content}
                onClick={() => handleCheckboxChange(task.id)}
              />
            </FormGroup>
          ))}
        </div>
        {pageCount > 1 && (
          <Stack
            spacing={2}
            style={{
              marginTop: "2%",
            }}
          >
            <Pagination
              count={pageCount}
              page={page}
              onChange={(_, value) => setPage(value)}
              variant="outlined"
              shape="rounded"
              style={{ display: "flex", justifyContent: "center" }}
            />
          </Stack>
        )}
      </Paper>
    </>
  );
}
