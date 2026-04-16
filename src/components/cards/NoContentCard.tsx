import { Box, Typography } from "@mui/material";

const NoContentCard = (props: { contentType: string }) => {
  const { contentType } = props;
  return (
    <Box
      sx={{
        width: "100%",
        // borderRadius: "16px",
        height: "300px",
        alignContent: "center",
      }}
    >
      <Typography
        color={"grey"}
        alignItems={"center"}
        fontSize={22}
        sx={{ textAlign: "center" }}
      >
        No {contentType} to display right now
      </Typography>
    </Box>
  );
};

export default NoContentCard;
