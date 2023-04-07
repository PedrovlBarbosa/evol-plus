import { useRef, useEffect, useState } from "react";
import { CameraAlt } from "@mui/icons-material";
import { IconButton } from "@mui/material";

interface CameraWithFrameProps {
  imageSource: string;
  clientLogo?: string;
}

const CameraWithFrame = ({ imageSource, clientLogo }: CameraWithFrameProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  // alter to really get if the user is on mobile or not
  const isMobile = Boolean(navigator.userAgent.match(/Android|iPhone/i))
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const [takenPicture, setTakenPicture] = useState("");

  //put a switch at the camera and use it inside it
  // setUseFrontCamera(true);
  const toggleCamera = () => {
    setUseFrontCamera((prev) => !prev);
  };

  useEffect(() => {
    const getUserMediaVideo = () => {
      if (isMobile) {
        if (useFrontCamera) return { facingMode: { exact: "user" } };
        return { facingMode: { exact: "environment" } };
      }
      return true;
    };

    let stream: MediaStream | undefined;
    navigator.mediaDevices
      .getUserMedia({ video: getUserMediaVideo() })
      .then((mediaStream) => {
        stream = mediaStream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Failed to access camera:", error);
      });
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, [isMobile, useFrontCamera]);

  const objectsStyles = {
    width: "100%",
    height: "100%",
  };

  const getVideoStyle = () => {
    return useFrontCamera
      ? { ...objectsStyles, transform: "scaleX(-1)" }
      : objectsStyles;
  };

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          videoRef.current,
          0,
          0,
          videoRef.current.videoWidth,
          videoRef.current.videoHeight
        );
        setTakenPicture(canvas.toDataURL());
      }
    }
  };

  const clientLogoComponent = () => (
    <img
      src={clientLogo}
      alt="client logo"
      style={{
        position: "absolute",
        bottom: "16px",
        right: "16px",
        width: "64px",
        height: "64px",
        objectFit: "contain",
      }}
    ></img>
  );

  return (
    <>
      {takenPicture ? (
        <div style={{ position: "relative" }}>
          <img
            src={takenPicture}
            alt="taken by the user"
            style={{ ...objectsStyles }}
          ></img>
          {clientLogo && clientLogoComponent()}
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <video ref={videoRef} autoPlay muted style={getVideoStyle()} />
          <img
            style={{
              ...objectsStyles,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              filter: "invert(100%)",
              objectFit: "contain",
            }}
            src={imageSource}
            alt="camera"
          />
          {clientLogo && clientLogoComponent()}
          <IconButton
            sx={{
              position: "absolute",
              bottom: "16px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "white",
              color: "black",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
            onClick={captureImage}
          >
            <CameraAlt />
          </IconButton>
        </div>
      )}
    </>
  );
};

export default CameraWithFrame;
