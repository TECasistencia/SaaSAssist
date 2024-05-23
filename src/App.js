import React from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import PrivateRoute from "./contexts/PrivateRoute";

// Importa tus componentes aquí
import Login from "./components/Login";
import AdminTable from "./components/Admin/AdminTable";
import PageInicio from "./components/PageInicio";
import ViewCamera from "./components/ViewCamera";
import ViewDataHistoryClass from "./components/ViewDataHistoryClass";
import ViewDataHistoryDate from "./components/ViewDataHistoryDate";
import ViewDataHistoryAG from "./components/ViewDataHistoryAG";
import GuestTable from "./components/GuestTable";
import StudentTable from "./components/StudentTable.js";
import ViewAsigClasesProfesor from "./components/ViewAsigClasesProfesor";
import CameraTable from "./components/CameraTable";
import SpaceTable from "./components/SpaceTable";
import CursoTable from "./components/CursoTable";
import ViewClassList from "./components/ViewClassList";
import PeriodTable from "./components/PeriodTable";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/Login" element={<Login />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<PageInicio />} />
          </Route>

          <Route path="/Admins" element={<PrivateRoute />}>
            <Route path="/Admins" element={<AdminTable />} />
          </Route>

          <Route path="/StudentTable" element={<PrivateRoute />}>
            <Route path="/StudentTable" element={<StudentTable />} />
          </Route>

          <Route path="/Guests" element={<PrivateRoute />}>
            <Route path="/Guests" element={<GuestTable />} />
          </Route>

          <Route path="/CursoTable" element={<PrivateRoute />}>
            <Route path="/CursoTable" element={<CursoTable />} />
          </Route>

          <Route path="/PeriodTable" element={<PrivateRoute />}>
            <Route path="/PeriodTable" element={<PeriodTable />} />
          </Route>

          <Route path="/ViewDataHistoryClass" element={<PrivateRoute />}>
            <Route
              path="/ViewDataHistoryClass"
              element={<ViewDataHistoryClass />}
            />
          </Route>

          <Route path="/SpaceTable" element={<PrivateRoute />}>
            <Route path="/SpaceTable" element={<SpaceTable />} />
          </Route>

          <Route path="/CameraTable" element={<PrivateRoute />}>
            <Route path="/CameraTable" element={<CameraTable />} />
          </Route>

          <Route path="/ViewCamera" element={<PrivateRoute />}>
            <Route path="/ViewCamera" element={<ViewCamera />} />
          </Route>

          <Route path="/ViewDataHistoryDate" element={<PrivateRoute />}>
            <Route
              path="/ViewDataHistoryDate"
              element={<ViewDataHistoryDate />}
            />
          </Route>

          <Route path="/ViewDataHistoryAG" element={<PrivateRoute />}>
            <Route path="/ViewDataHistoryAG" element={<ViewDataHistoryAG />} />
          </Route>

          <Route path="/ViewAsigClasesProfesor" element={<PrivateRoute />}>
            <Route
              path="/ViewAsigClasesProfesor"
              element={<ViewAsigClasesProfesor />}
            />
          </Route>

          <Route path="/ViewClassList" element={<PrivateRoute />}>
            <Route path="/ViewClassList" element={<ViewClassList />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
