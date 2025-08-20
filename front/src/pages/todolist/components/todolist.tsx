import { useEffect, useState } from "react";
import { getTodoList } from "../../../shared/api/todolistAPI";

import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Paper,
  Stack,
  Pagination,
} from "@mui/material";
import CreateList from "./createlist";

interface Task {
  id: number;
  content: string;
  is_done: boolean;
}

const pageSize = 8;

export default function TodoList() {
  const [tastks, setTasks] = useState<Task[]>([]);
  const [page, setPage] = useState<number>(1);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const getTasks = async () => {
      try {
        const tasks = await getTodoList();
        setTasks(tasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };
    getTasks();
  }, []);

  const handleCheckboxChange = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, is_done: !task.is_done } : task
      )
    );
  };

  const pageCount = Math.ceil(tastks?.length / pageSize);
  const pageTasks = tastks.slice((page - 1) * pageSize, page * pageSize);

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <h1 className="text-center text-xl">Todo List</h1>
        <CreateList
          open={open}
          onClose={() => setOpen(false)}
          onCreateClick={() => setOpen(true)}
        />
      </Stack>
      <Paper
        style={{
          padding: "5%",
          marginTop: "4%",
          width: "100%",
          minHeight: "88%",
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
        <Stack>
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
        </Stack>
      </Paper>
    </>
  );
}
