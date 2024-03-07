import React, { useRef, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./styles/styleViewCamera.css";
import videoSource from "../media/IA_Video.mp4";

function ViewCamera() {
  /*const playerRef = useRef(null);

  useEffect(() => {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(playerRef.current, {
        height: "100%",
        width: "100%",
        videoId: "_iQQaRkWmys?si=G5vGWr8N6qKyK865", // Reemplaza "VIDEO_ID_HERE" con el ID de tu video de YouTube
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          loop: 1,
          playsinline: 1,
          rel: 0,
          showinfo: 0,
        },
      });
    };
  }, []);*/

  return (
    <div /*style={{ height: "100vh" }}*/>
      <Header />
      {/*<div ref={playerRef}></div>*/}
      <div className="video-container">
        <video className="video" controls>
          <source src={videoSource} type="video/mp4" />
        </video>
      </div>
      <Footer />
    </div>
  );
}

export default ViewCamera;
