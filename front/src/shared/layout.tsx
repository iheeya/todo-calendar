import { Outlet } from "react-router-dom";
import Navigator from "./navigator";

export default function Layout() {
  return (
    <div>
      <main>
        <Outlet />
      </main>
      <Navigator />
    </div>
  );
}
