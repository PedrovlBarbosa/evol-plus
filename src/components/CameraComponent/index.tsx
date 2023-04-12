import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Grid,
  Input,
} from "@mui/material";
import { useState } from "react";
import CameraWithFrame from "../CameraWithFrame";
import mouthFrame from "../../assets/frontMouthFrame.png";
import CloseIcon from "@mui/icons-material/Close";
import cameraIcon from "../../assets/iconCamera.png";
import canetaIcon from "../../assets/iconCaneta.png";

const CameraComponent = () => {
  const [takingPicture, setTakingPicture] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = () => {
        if (typeof reader.result === "string") {
          setSelectedImage(reader.result);
        }
      };
    }
  };

  const takePhoto = () => {
    setTakingPicture(true);
  };

  const closeCamera = () => {
    setTakingPicture(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        {takingPicture ? (
          <Card sx={{ position: "relative", width: "100%", height: "100%" }}>
            <CardContent
              component={() => (
                <CameraWithFrame
                  imageSource={mouthFrame}
                  clientLogo={selectedImage}
                ></CameraWithFrame>
              )}
            ></CardContent>
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                color: "black",
                backgroundColor: "white",
                mt: 1,
                mr: 1,
              }}
              size="small"
              onClick={closeCamera}
            >
              <CloseIcon />
            </IconButton>
          </Card>
        ) : (
          <Grid container direction="column">
            <Grid item xs={12} mx="auto">
              <Button
                onClick={takePhoto}
                variant="contained"
                color="primary"
                style={{
                  height: "30vw",
                  minHeight: "30vh",
                  minWidth: "210px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textTransform: "none",
                }}
              >
                <img
                  src={cameraIcon}
                  alt="cameraIcon"
                  style={{
                    maxWidth: "80%",
                    maxHeight: "80%",
                  }}
                />
                <span>Tirar Foto</span>
              </Button>
            </Grid>
            <Grid item xs={12} mx="auto" pt={2}>
              <Button
                variant="contained"
                color="primary"
                component="label"
                htmlFor="upload-logo-input"
                style={{
                  height: "30vw",
                  minHeight: "30vh",
                  minWidth: "210px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textTransform: "none",
                }}
              >
                <img
                  src={canetaIcon}
                  alt="logoIcon"
                  style={{ maxWidth: "80%", maxHeight: "80%" }}
                />
                <span>Upload de Logo</span>
                <Input
                  id="upload-logo-input"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default CameraComponent;
