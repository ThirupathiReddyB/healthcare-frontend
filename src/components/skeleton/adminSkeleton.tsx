import { Box, Skeleton } from "@mui/material";

function adminTableSkeleton() {
  return (
    <Box sx={{ width: "100%", marginTop: "10px" }}>
      <Skeleton height={"60px"} width={"300px"} />
      <Skeleton animation="wave" height={"50px"} />
      <Skeleton animation="wave" height={"50px"} />
      <Skeleton animation="wave" height={"50px"} />
      <Skeleton animation="wave" height={"50px"} />
      <Skeleton animation="wave" height={"50px"} />
    </Box>
  );
}

export default adminTableSkeleton;
