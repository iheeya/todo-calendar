import {
  BrowserRouter as Router,
  Routes,
  Route,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Mainpage from "./pages/mainpage";
import Layout from "./shared/layout";
import Statistics from "./pages/statistics/statistics";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Mainpage />,
      },
      {
        path: "/statistics",
        element: <Statistics />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
