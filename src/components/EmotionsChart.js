import React, { useState, useEffect } from "react";
import { Slider, Typography } from "@mui/material";
import "../styles/styleEmotionsChart.css";

function EmotionsChart({
  orientation,
  position,
  inline = false,
  dynamicData = true,
}) {
  const initialEmotionsData = {
    Felicidad: 90,
    Ira: 5,
    Tristeza: 5,
    Miedo: 5,
    Sorpresa: 5,
  };
  const [emotionsData, setEmotionsData] = useState(initialEmotionsData);

  useEffect(() => {
    if (dynamicData) {
      const interval = setInterval(() => {
        const newEmotionsData = {
          Felicidad: Math.floor(Math.random() * 101),
          Ira: Math.floor(Math.random() * 101),
          Tristeza: Math.floor(Math.random() * 101),
          Miedo: Math.floor(Math.random() * 101),
          Sorpresa: Math.floor(Math.random() * 101),
        };
        setEmotionsData(newEmotionsData);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [dynamicData]);

  const getSliderLabel = (emotion) => {
    return (
      <Typography variant="body2" gutterBottom>
        {emotion}
      </Typography>
    );
  };

  const getPositionStyle = () => {
    if (position === "top-right") {
      return {
        position: "absolute",
        top: "10px",
        right: "30px",
        width: "100px",
        zindex: "1",
      };
    } else if (position === "center") {
      return {
        display: "flex",
        flexwrap: "wrap",
        alignitems: "flex-end",
        justifycontent: "center",
        left: "50%",
      };
    }
  };

  return (
    <div className="emotions-sliders" style={getPositionStyle()}>
      {Object.entries(emotionsData).map(([emotion, value]) => (
        <div
          key={emotion}
          style={inline ? { display: "inline-block", margin: "10px" } : null}
          className="slider-wrapper"
        >
          {getSliderLabel(emotion)}
          <Slider
            className={`slider-${emotion}`}
            orientation={orientation}
            value={value}
            aria-labelledby="continuous-slider"
            valueLabelDisplay="auto"
            min={0}
            max={100}
            onChange={(event, newValue) =>
              setEmotionsData((prevEmotionsData) => ({
                ...prevEmotionsData,
                [emotion]: newValue,
              }))
            }
            components={{
              Thumb: () => null,
            }}
          />
        </div>
      ))}
    </div>
  );
}

export default EmotionsChart;
