import { Box } from "@mui/material";
import { NoAccess } from "../../assets/images";

const NoAccessRights = () => {
  return (
    <Box
      component="img"
      sx={{
        maxHeight: {
          xs: "60vh",
          md: "100vh",
        //   border: "1px solid red",
        },
      }}
      alt="No Access Rights"
      src={NoAccess}
    />
  );
};

export default NoAccessRights;
