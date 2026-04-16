import { Box, Card, Grid, Typography } from "@mui/material";
import { iconMap } from "../../assets/icons";

const DashboardStatisticCard = (props: {
  title: string;
  stat: number;
  icon: string;
}) => {
  const { title, stat, icon } = props;

  const IconComponent = iconMap[icon as keyof typeof iconMap];
  return (
    <Grid item md={2.4}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
          paddingLeft: "5px",
          paddingRight: "5px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Box sx={{mt:2 ,ml:1}}>
            {IconComponent && <IconComponent size={24} color="#EF7612" />}
          </Box>
          <Typography sx={{ p: 2, textAlign: "left", fontSize: 18 }}>
            {title}
          </Typography>
        </Box>
        <Typography fontSize={24} fontWeight={600} sx={{ p: 2 }}>
          {stat || 0}
        </Typography>
      </Card>
    </Grid>
  );
};

export default DashboardStatisticCard;
