import { Box } from "@mui/material";
import { serverDown } from "../../assets/images";

const ServerDownImage = ({ center = false }) => {
  if (!center) {
    // If center is false, return only the image without any parent Box.
    return (
      <Box
        component="img"
        sx={{
          maxHeight: {
            xs: "20vh",
            md: "60vh",
          },
          marginBottom: "10px",
        }}
        alt="Server down"
        src={serverDown}
      />
    );
  }

  // If center is true, return the centered layout.
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        paddingBottom: "20px",
        paddingLeft: "0px",
      }}
    >
      <Box
        component="img"
        sx={{
          maxHeight: {
            xs: "20vh",
            md: "60vh",
          },
          marginBottom: "10px",
        }}
        alt="Server down"
        src={serverDown}
      />
    </Box>
  );
};

export default ServerDownImage;
