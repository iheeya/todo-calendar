import axiosInstance from "./axiosInstance";

export function getTodoList() {
  return axiosInstance
    .get("/tasks")
    .then((response) => {
      const data = response.data;
      const tasks = data;
      return Promise.resolve(tasks);
    })
    .catch((e) => {
      return Promise.reject(e);
    });
}

interface PostTodoParams {
  content: string;
  is_done: boolean;
}

export function PostTodo(taskContent: PostTodoParams) {
  return axiosInstance
    .post("/tasks", taskContent)
    .then((response) => {
      return Promise.resolve(response.data);
    })
    .catch((e) => {
      return Promise.reject(e);
    });
}

export function PostCheckbox(taskId: number, isDone: boolean) {
  return axiosInstance
    .patch(`/tasks/${taskId}`, { is_done: isDone })
    .then((response) => {
      return Promise.resolve(response.data);
    })
    .catch((e) => {
      return Promise.reject(e);
    });
}
