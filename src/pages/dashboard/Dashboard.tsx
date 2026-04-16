import { Box, Card, Grid, Typography } from "@mui/material";
import { useGetDashboardDataRequest } from "../../services/steigenApisService";
import GenderAnalysisChart from "../../components/charts/GenderAnalysisChart";
import ServerDownImage from "../../components/cards/serverDown";
import DashboardSkeleton from "../../components/skeleton/dashboardSkeleton";
import NoAccessRights from "../../components/cards/NoAccessRights";
import DashboardStatisticCard from "../../components/cards/DashboardStatisticCard";

const Dashboard = () => {
  const {
    data: DashboardData,
    error,
    isPending,
  }: { data: any; error: any; isPending: any } = useGetDashboardDataRequest();

  if (isPending) {
    return <DashboardSkeleton />;
  }

  if (error?.response?.status === 401) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <NoAccessRights />
      </Box>
    );
  }

  if (error?.code === "ERR_NETWORK") {
    return <ServerDownImage center={true} />;
  }

  return (
    <Box>
      <Grid container spacing={2}>
        <DashboardStatisticCard
          stat={DashboardData?.data?.data?.totalUsers}
          title={"Total Users"}
          icon={"FiUsers"}
        />
        <DashboardStatisticCard
          stat={DashboardData?.data?.data?.monthlyActiveUser}
          title={"Monthly Active Users"}
          icon={"FiUserCheck"}
        />
        <DashboardStatisticCard
          stat={DashboardData?.data?.data?.monthlyinActiveUsers}
          title={"Monthly Inactive Users"}
          icon={"FiUserX"}
        />
        <Grid item md={2.4}>
          <Card
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              height: "100%",
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
            }}
          >
            <Typography></Typography>
            <Typography variant="h6"></Typography>
          </Card>
        </Grid>
        <Grid item md={6}>
          <Card sx={{ height: "95%", p: 2 }}>
            <Typography mb={1} fontSize={24} fontWeight={500}>
              Analysis of Total Users by Gender
            </Typography>
            <GenderAnalysisChart analysisData={DashboardData?.data?.data} />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
