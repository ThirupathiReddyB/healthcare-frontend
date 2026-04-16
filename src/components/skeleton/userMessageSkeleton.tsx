import { Box, Skeleton } from "@mui/material";

export function MessageSkeleton() {
  return (
    <Box sx={{ width: "100%", marginTop: "5px" }}>
      <Box sx={{ display: "flex", gap: "20px" }}>
        <Skeleton animation="wave" height={"50px"} width={"100px"} />
        <Skeleton animation="wave" height={"50px"} width={"100px"} />
      </Box>
      <Skeleton
        animation="wave"
        height={"60px"}
        width={"200px"}
        sx={{ marginTop: "10px" }}
      />
      <Skeleton animation="wave" height={"50px"} />

      <Skeleton
        animation="wave"
        height={"60px"}
        width={"200px"}
        sx={{ marginTop: "10px" }}
      />
      <Skeleton animation="wave" height={"50px"} width={"80%"} />

      <Skeleton
        animation="wave"
        height={"60px"}
        width={"200px"}
        sx={{ marginTop: "10px" }}
      />
      <Skeleton animation="wave" height={"50px"} width={"80%"} />

      <Skeleton
        animation="wave"
        height={"60px"}
        width={"200px"}
        sx={{ marginTop: "10px" }}
      />
      <Skeleton animation="wave" height={"50px"} width={"80%"} />
    </Box>
  );
}
