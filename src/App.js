import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import PrivateRoute from "./contexts/PrivateRoute";
import Login from "./components/Login";
import AdminTable from "./components/Admin/AdminTable";
import PageInicio from "./components/PageInicio";
import ViewCamera from "./components/ViewCamera";
import ViewDataHistoryClass from "./components/ViewDataHistoryClass";
import ViewDataHistoryDate from "./components/ViewDataHistoryDate";
import ViewDataHistoryAG from "./components/ViewDataHistoryAG";
import GuestTable from "./components/GuestTable";
import StudentTable from "./components/StudentTable.js";
import CameraTable from "./components/CameraTable";
import SpaceTable from "./components/SpaceTable";
import CursoTable from "./components/CursoTable";
import PeriodTable from "./components/PeriodTable";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<PageInicio />} />
            <Route path="/Admins" element={<AdminTable />} />
            <Route path="/StudentTable" element={<StudentTable />} />
            <Route path="/Guests" element={<GuestTable />} />
            <Route path="/CursoTable" element={<CursoTable />} />
            <Route path="/PeriodTable" element={<PeriodTable />} />
            <Route
              path="/ViewDataHistoryClass"
              element={<ViewDataHistoryClass />}
            />
            <Route path="/SpaceTable" element={<SpaceTable />} />
            <Route path="/CameraTable" element={<CameraTable />} />
            <Route path="/ViewCamera" element={<ViewCamera />} />
            <Route
              path="/ViewDataHistoryDate"
              element={<ViewDataHistoryDate />}
            />
            <Route path="/ViewDataHistoryAG" element={<ViewDataHistoryAG />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
