import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ViewCamera from "../components/ViewCamera";
import ViewDataHistoryClass from "../components/ViewDataHistoryClass";
import ViewDataHistoryDate from "../components/ViewDataHistoryDate";
import ViewDataHistoryAG from "../components/ViewDataHistoryAG";
import ViewAddClases from "../components/ViewAddClases";
import ViewClassList from "../components/ViewClassList";

const PrivateRoute = () => {
  const { isAuthenticated, isAdmin, isInvited, isPrincipal } =
    useContext(AuthContext);
  // Verifica si el usuario está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  // Verifica el tipo de usuario y permite el acceso según el tipo
  if (isPrincipal) {
    // El usuario principal tiene acceso a todas las rutas
    return <Outlet />;
  } else if (isAdmin) {
    // El administrador tiene acceso a las rutas específicas
    return (
      <Outlet>
        <Route path="/ViewAddClases" element={<ViewAddClases />} />
        <Route
          path="/ViewDataHistoryClass"
          element={<ViewDataHistoryClass />}
        />
        <Route path="/ViewCamera" element={<ViewCamera />} />
        <Route path="/ViewDataHistoryDate" element={<ViewDataHistoryDate />} />
        <Route path="/ViewDataHistoryAG" element={<ViewDataHistoryAG />} />
        <Route path="/ViewClassList" element={<ViewClassList />} />
      </Outlet>
    );
  } else if (isInvited) {
    // El usuario invitado tiene acceso a las rutas específicas
    return (
      <Outlet>
        <Route
          path="/ViewDataHistoryClass"
          element={<ViewDataHistoryClass />}
        />
        <Route path="/ViewDataHistoryDate" element={<ViewDataHistoryDate />} />
        <Route path="/ViewDataHistoryAG" element={<ViewDataHistoryAG />} />
      </Outlet>
    );
  } else {
    // Por defecto, si no se cumple ninguna condición, redirige al inicio
    return <Navigate to="/Login" />;
  }
};

export default PrivateRoute;
