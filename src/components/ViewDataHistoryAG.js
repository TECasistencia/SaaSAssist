import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/styleViewDataHistoryAG.css";
import ModalListAssist from "../modals/ModalListAssist";

function ViewDataHistoryAG() {
  const { state } = useLocation();
  return (
    <div className="contentAG">
      <Header />
      <div className="contentInternAG">
        <div className="information">
          <h2>{state?.className}</h2>
        </div>
        <div className="informationDet">
          <p>Aula: {state?.classroom}</p>
          <p>Fecha: {state?.date}</p>
          <p>Profesor: {state?.teacher}</p>
        </div>
        <br />
        <br />
        <div className="assist">
          <h2>Lista de Asistencia</h2>
          <ModalListAssist />
          <br />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ViewDataHistoryAG;
