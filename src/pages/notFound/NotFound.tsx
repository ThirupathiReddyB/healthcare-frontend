import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import notFound from "../../assets/images/not-found.png";

export const NotFound = () => {
  const navigate = useNavigate();

  const retHomeHandler = () => {
    navigate("/dashboard");
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Box>
        <img src={notFound} alt=" " />
      </Box>
      <br />
      <Typography variant="h5">Page Not Found</Typography>
      <br />
      <Button
        onClick={retHomeHandler}
        variant="contained"
        color="primary"
        sx={{
          marginTop: "16px",
          background:
            "linear-gradient(90deg,rgba(255, 102, 0, 0.8), rgba(255, 102, 0, 0.5))",
          borderRadius: "10px",
        }}
      >
        Go Back Home
      </Button>
    </Box>
  );
};
