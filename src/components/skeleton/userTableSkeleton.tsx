import { Box, Skeleton } from "@mui/material";

function UserTableSkeleton() {
  return (
    <Box sx={{ width: "100%", marginTop: "10px" }}>
      <Skeleton animation="wave" height={"70px"} />
      <Skeleton animation="wave" height={"70px"} />
      <Skeleton animation="wave" height={"70px"} />
      <Skeleton animation="wave" height={"70px"} />
      <Skeleton animation="wave" height={"70px"} />
      <Skeleton animation="wave" height={"70px"} />
      <Skeleton animation="wave" height={"70px"} />
      <Skeleton animation="wave" height={"70px"} />
      <Skeleton animation="wave" height={"70px"} />
      <Skeleton animation="wave" height={"70px"} />
    </Box>
  );
}

export default UserTableSkeleton;
