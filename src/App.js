import * as React from "react";
import "./App.css";
import Login from "./components/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminTable from "./components/AdminTable";
import PageInicio from "./components/PageInicio";
import ViewCamera from "./components/ViewCamera";
import ViewDataHistoryClass from "./components/ViewDataHistoryClass";
import ViewDataHistoryDate from "./components/ViewDataHistoryDate";
import ViewDataHistoryAG from "./components/ViewDataHistoryAG";
import GuestTable from "./components/GuestTable";
import UserTable from "./components/UserTable";
import ViewAsigClasesProfesor from "./components/ViewAsigClasesProfesor";

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
  {
    path: "/ViewDataHistoryClass",
    element: <ViewDataHistoryClass />,
  },
  {
    path: "/ViewDataHistoryDate/:id",
    element: <ViewDataHistoryDate />,
  },
  {
    path: "/ViewDataHistoryAG/:id",
    element: <ViewDataHistoryAG />,
  },
  {
    path: "/ViewAsigClasesProfesor",
    element: <ViewAsigClasesProfesor />,
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
