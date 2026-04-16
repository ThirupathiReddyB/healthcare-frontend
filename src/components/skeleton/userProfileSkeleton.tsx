import React from "react";
import { Grid, Card, CardContent, Typography, Box, Skeleton } from "@mui/material";
import { BiArrowBack } from "react-icons/bi";

// Styles
const skeletonCardStyle = {
  borderRadius: "10px",
  boxShadow: "none",
  backgroundColor: "#fbfbfb",
  marginBottom: "20px",
};

const skeletonIconStyle = {
  backgroundColor: "#f5f5f5",
  borderRadius: "50%",
  padding: "8px",
  display: "flex",
};

const SkeletonText = ({ width, height, style }: { width: number | string; height: number; style?: React.CSSProperties }) => (
  <Skeleton width={width} height={height} style={style} />
);

const SkeletonAvatar = ({ size }: { size: number }) => (
  <Skeleton variant="circular" width={size} height={size} />
);

const UserProfileSkeleton = () => {
  return (
    <Grid container spacing={3}>
      {/* Header */}
      <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
        <Box display={"flex"} alignItems={"center"}>
          <BiArrowBack color="black" size={18} />
          <SkeletonText width={150} height={30} style={{ marginLeft: 16 }} />
        </Box>
        <SkeletonText width={120} height={30} />
      </Grid>

      {/* Left Column */}
      <Grid item xs={12} md={6}>
        {/* Basic Info Card */}
        <Card style={skeletonCardStyle}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3} display="flex" alignItems="center" flexDirection={"column"}>
                <SkeletonAvatar size={80} />
                <SkeletonText width={60} height={20} style={{ paddingTop: 8 }} />
              </Grid>
              <Grid item xs={9}>
                <Grid container spacing={1}>
                  {['Email', 'Phone', 'Blood Type'].map((text) => (
                    <Grid item xs={12} display="flex" alignItems="center" key={text}>
                      <Box style={skeletonIconStyle}>
                        <Skeleton variant="circular" width={24} height={24} />
                      </Box>
                      <SkeletonText width={100} height={20} style={{ paddingLeft: 8 }} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Account Information Card */}
        <Card style={skeletonCardStyle}>
          <CardContent>
            <Typography><SkeletonText width={200} height={30} /></Typography>
            <Grid container spacing={1}>
              {['Created', 'Language', 'Subscription'].map((label) => (
                <React.Fragment key={label}>
                  <Grid item xs={4}>
                    <Typography color="textSecondary">
                      <SkeletonText width={100} height={20} />
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <SkeletonText width="100%" height={20} />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Health Information Card */}
        <Card style={skeletonCardStyle}>
          <CardContent>
            <Typography><SkeletonText width={200} height={30} /></Typography>
            <Grid container spacing={1}>
              {['Family Doctor Name', 'Doctor Address', 'Disease', 'Allergies'].map((label) => (
                <React.Fragment key={label}>
                  <Grid item xs={4}>
                    <Typography color="textSecondary">
                      <SkeletonText width={100} height={20} />
                    </Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <SkeletonText width="100%" height={20} />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Right Column */}
      <Grid item xs={12} md={6}>
        {/* Personal Information Card */}
        <Card style={skeletonCardStyle}>
          <CardContent>
            <Typography><SkeletonText width={200} height={30} /></Typography>
            <Grid container spacing={2}>
              {['Country', 'Date of Birth', 'Pincode', 'Emergency Contact', 'Address'].map((label) => (
                <Grid item xs={4} key={label}>
                  <Typography color="textSecondary">
                    <SkeletonText width={100} height={20} />
                  </Typography>
                  <SkeletonText width="100%" height={20} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Family Member Card */}
        <Card style={skeletonCardStyle}>
          <CardContent>
            <Typography><SkeletonText width={200} height={30} /></Typography>
            <Grid container spacing={2}>
              {Array.from({ length: 3 }).map((_, index) => (
                <Grid item xs={12} display={"flex"} flexDirection={"column"} alignItems={"center"} key={index+1}>
                  <SkeletonAvatar size={56} />
                  <SkeletonText width={80} height={20} style={{ marginTop: 8 }} />
                  <SkeletonText width={60} height={20} />
                </Grid>
              ))}
              <Grid display={"flex"} flexDirection={"column"} alignItems={"center"} height={"90px"}>
                <SkeletonText width={60} height={20} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Additional Information Card */}
        <Card style={skeletonCardStyle}>
          <CardContent>
            <Typography><SkeletonText width={200} height={30} /></Typography>
            <SkeletonText width="100%" height={20} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default UserProfileSkeleton;
