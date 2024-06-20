import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import PageInicio from "../components/PageInicio";
import ViewCamera from "../components/ViewCamera";
import ViewDataHistoryClass from "../components/ViewDataHistoryClass";
import ViewDataHistoryDate from "../components/ViewDataHistoryDate";
import ViewDataHistoryAG from "../components/ViewDataHistoryAG";
import CursoTable from "../components/CursoTable";

const PrivateRoute = () => {
  const { isAuthenticated, isAdmin, isInvited, isPrincipal } =
    useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  if (isInvited) {
    return (
      <Routes>
        <Route path="/" element={<ViewDataHistoryClass />}></Route>
        <Route
          path="/ViewDataHistoryClass"
          element={<ViewDataHistoryClass />}
        />
      </Routes>
    );
  }

  if (isPrincipal) {
    return <Outlet />;
  }

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/" element={<PageInicio />}></Route>
        <Route
          path="/ViewDataHistoryClass"
          element={<ViewDataHistoryClass />}
        />
        <Route path="/ViewDataHistoryDate" element={<ViewDataHistoryDate />} />
        <Route path="/ViewDataHistoryAG" element={<ViewDataHistoryAG />} />
        <Route path="/ViewCamera" element={<ViewCamera />} />
        <Route path="/CursoTable" element={<CursoTable />} />
      </Routes>
    );
  }

  // Por defecto, si no se cumple ninguna condición, redirige al inicio
  return <Navigate to="/Login" />;
};

export default PrivateRoute;
