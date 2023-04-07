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
                color: "white",
              }}
              onClick={closeCamera}
            >
              <CloseIcon />
            </IconButton>
          </Card>
        ) : (
          <Grid container direction="column" spacing={2}>
            <Grid item xs={12}>
              <label>Upload de logo PNG: </label>
              <Input type="file" onChange={handleImageChange} />
            </Grid>

            <Grid item xs={12}>
              <Button onClick={takePhoto}>Tirar foto</Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default CameraComponent;
