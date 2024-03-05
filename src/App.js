import * as React from "react";
import "./App.css";
import Login from "./components/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminTable from "./components/AdminTable";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/Admins",
    element: <AdminTable />,
  },
  // {
  //   path: "/home-page",
  //   element: <Drawer />,
  //   children: [
  //     {
  //       path: "usuarios",
  //       element: <UsersTable />,
  //     },

  //   ],
  // },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
