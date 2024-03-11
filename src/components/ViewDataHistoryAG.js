import React from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import EmotionsChart from "./EmotionsChart";
import "../styles/styleViewDataHistoryAG.css";
import ViewListAssist from "../modals/ViewListAssist";

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
        <div className="contentGrafic">
          <h2>Grafica</h2>
          <div className="emotions-chart-wrapper">
            <EmotionsChart
              orientation="vertical"
              position="center"
              inline={true}
              dynamicData={false}
            />
          </div>
        </div>
        <br />
        <br />
        <div className="assist">
          <h2>Lista de Asistencia</h2>
          <ViewListAssist />
          <br />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ViewDataHistoryAG;
