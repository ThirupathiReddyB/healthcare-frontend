import { Box, Skeleton } from "@mui/material";

export function VideoSkeleton() {
  return (
    <Box sx={{ width: "100%", marginTop: "5px" }}>
      <Skeleton height={"60px"} />
      <Skeleton animation="wave" height={"50px"} />
      <Skeleton animation="wave" height={"50px"} />
      <Skeleton animation="wave" height={"50px"} />
    </Box>
  );
}

export function AdvFacSkeleton() {
  return (
    <Box sx={{ display: "flex", marginTop: "5px", gap: "50px" }}>
      <Skeleton animation="wave" height={"350px"} width={"350px"} />
      <Skeleton animation="wave" height={"350px"} width={"350px"} />
      <Skeleton animation="wave" height={"350px"} width={"350px"} />
      <Skeleton animation="wave" height={"350px"} width={"350px"} />
    </Box>
  );
}
