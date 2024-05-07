import React from "react";
import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthContext";
import PrivateRoute from "./contexts/PrivateRoute";

// Importa tus componentes aquí
import Login from "./components/Login";
import AdminTable from "./components/AdminTable";
import PageInicio from "./components/PageInicio";
import ViewCamera from "./components/ViewCamera";
import ViewDataHistoryClass from "./components/ViewDataHistoryClass";
import ViewDataHistoryDate from "./components/ViewDataHistoryDate";
import ViewDataHistoryAG from "./components/ViewDataHistoryAG";
import GuestTable from "./components/GuestTable";
import UserTable from "./components/UserTable";
import ViewAsigClasesProfesor from "./components/ViewAsigClasesProfesor";
import ViewAddCamera from "./components/ViewAddCamera";
import ViewAddClases from "./components/ViewAddClases";
import ViewClassList from "./components/ViewClassList";

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

          <Route path="/Users" element={<PrivateRoute />}>
            <Route path="/Users" element={<UserTable />} />
          </Route>

          <Route path="/Guests" element={<PrivateRoute />}>
            <Route path="/Guests" element={<GuestTable />} />
          </Route>

          <Route path="/ViewAddClases" element={<PrivateRoute />}>
            <Route path="/ViewAddClases" element={<ViewAddClases />} />
          </Route>

          <Route path="/ViewDataHistoryClass" element={<PrivateRoute />}>
            <Route
              path="/ViewDataHistoryClass"
              element={<ViewDataHistoryClass />}
            />
          </Route>

          <Route path="/ViewAddCamera" element={<PrivateRoute />}>
            <Route path="/ViewAddCamera" element={<ViewAddCamera />} />
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
