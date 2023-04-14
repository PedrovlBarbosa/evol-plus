import { useRef, useEffect, useState } from "react";
import { CameraAlt } from "@mui/icons-material";
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import instagramIcon from "../../assets/instagramIcon.jpg";
import { IconButton } from "@mui/material";
import { CSSProperties } from 'react';

interface CameraWithPreviousProps {
    imagePrevious: string;
    clientLogo?: string;
  }

type Dimensions = Pick<CSSProperties, 'width' | 'aspectRatio'>;

export const CameraWithPrevious = ({ imagePrevious, clientLogo }: CameraWithPreviousProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const isMobile = Boolean(navigator.userAgent.match(/Android|iPhone/i));
    const [takenPicture, setTakenPicture] = useState("");
    const [useFrontCamera, setUseFrontCamera] = useState(false);
    const [frameDimensions, setFrameDimensions] = useState<Dimensions>({ width: "100%", aspectRatio: "auto" });

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

    const setFrameDimensionsFromDevice = ({ width, height }: MediaTrackSettings): void => {
        setFrameDimensions({
          width:       '100%',
          aspectRatio: `${width} / ${height}`,
        });
      };

      let stream: MediaStream | undefined;
      navigator.mediaDevices
        .getUserMedia({ video: getUserMediaVideo() })
        .then((mediaStream) => {
          stream = mediaStream;
  
          setFrameDimensionsFromDevice(stream.getVideoTracks()[0].getSettings());
  
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

    const shareImage = async () => {
        const response = await fetch(takenPicture);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', {type:blob.type});
        const data = {
          files: [file,],
          title: 'Compartilhar',
        };
        try {
          await navigator.share(data);
       } catch (err) {
         console.error(err);
       }
      };

    function getVideoStyle(): CSSProperties | undefined {
        throw new Error("Function not implemented.");
    }

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
                onClick={shareImage}
              >
                <img
                  src={instagramIcon}
                  alt="instagramIcon"
                  style={{ width: "24px", height: "24px" }}
                />
              </IconButton>
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
                src={imagePrevious}
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
    
              <IconButton
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  mt: 1,
                  ml: 3.3,
                  transform: "translateX(-50%)",
                  backgroundColor: "white",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "white",
                  },
                }}
                onClick={toggleCamera}
              >
                <CameraswitchIcon />
              </IconButton>
            </div>
          )}
        </>
      );
    };
    
    export default CameraWithPrevious;   
