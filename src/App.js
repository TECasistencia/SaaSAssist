import * as React from "react";
import "./App.css";
import Login from "./components/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminTable from "./components/AdminTable";
import PageInicio from "./components/PageInicio";
import ViewCamera from "./components/ViewCamera";
import GuestTable from "./components/GuestTable";
import UserTable from "./components/UserTable";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/Admins",
    element: <AdminTable />,
  },
  {
    path: "/Guests",
    element: <GuestTable />,
  },
  {
    path: "/Users",
    element: <UserTable />,
  },
  {
    path: "/Inicio",
    element: <PageInicio />,
  },
  {
    path: "/ViewCamera",
    element: <ViewCamera />,
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
