import { Box, Card, Grid, Skeleton, Typography } from "@mui/material";
import  { FC } from 'react';
const SkeletonCard: FC<{ iconSize?: number, textWidth?: number, textHeight?: number }> = ({ iconSize = 24, textWidth = 80, textHeight = 40 }) => (
  <Card
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      height: "100%",
      p: 2,
    }}
  >
    <Typography sx={{ textAlign: "center", fontSize: 18 }}>
      <Skeleton width={iconSize} height={iconSize} />
    </Typography>
    <Skeleton variant="text" width={textWidth} height={textHeight} />
  </Card>
);

const DashboardSkeleton = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item md={2.4}>
          <SkeletonCard />
        </Grid>
        <Grid item md={2.4}>
          <SkeletonCard />
        </Grid>
        <Grid item md={2.4}>
          <SkeletonCard />
        </Grid>
        <Grid item md={2.4}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
              p: 2,
            }}
          >
            <Typography></Typography>
            <Typography variant="h6"></Typography>
          </Card>
        </Grid>
        <Grid item md={2.4}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
              p: 2,
            }}
          >
            <Typography></Typography>
            <Typography variant="h6"></Typography>
          </Card>
        </Grid>
       
       
      </Grid>
      
      <Grid container spacing={2}>
        <Grid item md={6} sx={{ mt: 10 }}>
          <Card
            sx={{
              height: "100%",
              p: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography mb={1} fontSize={24} fontWeight={500}>
              <Skeleton width={200} height={30} />
            </Typography>
            <Skeleton variant="rectangular" width="100%" height={280} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardSkeleton;
