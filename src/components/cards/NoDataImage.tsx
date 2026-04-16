import { Box } from "@mui/material";
import { NoDataAvailable } from "../../assets/images";

const NoDataImage = () => {
  return (
    <Box
      component="img"
      sx={{
        maxHeight: {
          xs: "20vh",
          md: "60vh",
          //   alignContent: "center",
          //   alignItems: "center",
          //   display: "flex",
        },
      }}
      alt="No complaints found"
      src={NoDataAvailable}
    />
  );
};

export default NoDataImage;
