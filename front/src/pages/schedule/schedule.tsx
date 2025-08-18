import Calendar from "./components/calendar";
import TodoList from "./components/todolist";
import { Grid } from "@mui/material";

function App() {
  return (
    <div className="mx-5 mt-15">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Calendar />
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <TodoList />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
