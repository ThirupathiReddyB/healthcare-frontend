import { Box, Button, Card, Grid, Typography } from "@mui/material";
import { useGetAggrigateCmsDataRequest } from "../../services/steigenApisService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VideoAddForm from "../../components/forms/VideoAddForm";
import AddAdvertiseForm from "../../components/forms/AddAdvertiseForm";
import { useAppSelector } from "../../state/store";
import ServerDownImage from "../../components/cards/serverDown";
import { toast } from "react-toastify";
import NewAddFacilityForm from "../../components/forms/NewAddFacilityForm";
import AdvertiseSection from "./AdvertiseSection";
import FacilitySection from "./FacilitySection";
import VideoSection from "./VideoSection";

const ContentManagement = () => {
  const navigate = useNavigate();

  const { role } = useAppSelector((state) => state.storeUserData);

  const { isLoading, data: cmsData, error } = useGetAggrigateCmsDataRequest();

  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const handleOpenVideoTable = () => {
    navigate("/contentmanagement/videos");
    toast.info("Please refresh to ensure the video details are updated.");
  };

  const handleOpenVideoForm = () => {
    setOpen(true);
  };

  const [openAdvForm, setOpenAdvForm] = useState(false);

  const handleCloseAddAdvForm = () => setOpenAdvForm(false);
  const handleOpenAdvertiseForm = () => {
    setOpenAdvForm(true);
  };

  const [openFacForm, setOpenFacForm] = useState(false);

  const handleCloseAddFacForm = () => setOpenFacForm(false);
  const handleOpenFacilityForm = () => {
    setOpenFacForm(true);
  };

  const handleOpenFacilitiesTable = () => {
    navigate("/contentmanagement/facilities");
  };

  const handleOpenAdvertiseTable = () => {
    navigate("/contentmanagement/advertise");
  };

  if (error?.message === "Network Error")
    return <ServerDownImage center={true} />;

  return (
    <Box>
      <Grid container spacing={2}>
        {open && <VideoAddForm open={open} handleClose={handleClose} />}{" "}
        {openFacForm && (
          <NewAddFacilityForm
            open={openFacForm}
            handleCloseAddFacForm={handleCloseAddFacForm}
          />
        )}
        {openAdvForm && (
          <AddAdvertiseForm
            open={openAdvForm}
            handleClose={handleCloseAddAdvForm}
          />
        )}
        <Grid item md={12} xs={7} sm={12}>
          <Card
            sx={{
              borderRadius: "15px",
              boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)",
              width: "100%",
            }}
          >
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              width={"100%"}
              sx={{ my: 2 }}
            >
              <Box display={"flex"} sx={{ px: 2 }}>
                <Typography sx={{ pr: 4, fontSize: 22, fontWeight: 600 }}>
                  Videos
                </Typography>
                {role !== "auditor" && (
                  <Button
                    sx={{
                      mx: 2,
                      color: "#EF7612",
                      borderColor: "#EF7612",
                      textTransform: "none",
                      borderRadius: "10px",
                      height: "30px",
                      "&:hover": {
                        backgroundColor: "white",
                        border: "1px solid orange",
                      },
                    }}
                    variant="outlined"
                    onClick={handleOpenVideoForm}
                  >
                    Add
                  </Button>
                )}
              </Box>
              <Button
                sx={{ color: "#EF7612", textTransform: "none" }}
                onClick={handleOpenVideoTable}
                disabled={!cmsData?.data.data.data}
              >
                View all
              </Button>
            </Box>
            <Box sx={{ px: 2 }}>
              <VideoSection
              isLoading={isLoading}
              videoData={cmsData?.data.data.data}
            />
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            width={"100%"}
            sx={{ my: 2 }}
          >
            <Box display={"flex"}>
              <Typography sx={{ pr: 4, fontSize: 22, fontWeight: 600 }}>
                Advertise
              </Typography>
              {role !== "auditor" && (
                <Button
                  sx={{
                    mx: 2,
                    color: "#EF7612",
                    borderColor: "#EF7612",
                    textTransform: "none",
                    borderRadius: "10px",
                    height: "30px",
                    "&:hover": {
                      backgroundColor: "white",
                      border: "1px solid orange",
                    },
                  }}
                  variant="outlined"
                  onClick={handleOpenAdvertiseForm}
                >
                  Add
                </Button>
              )}
            </Box>
            <Button
              sx={{ color: "#EF7612", textTransform: "none" }}
              onClick={handleOpenAdvertiseTable}
              disabled={!cmsData?.data.data.data?.advertisements?.length}
            >
              View all
            </Button>
          </Box>
          <Grid container spacing={2}>
            <AdvertiseSection
              isLoading={isLoading}
              advertisements={cmsData?.data.data.data?.advertisements}
            />
          </Grid>
        </Grid>
        <Grid item xs={12} md={12} lg={12} xl={12} sm={12}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            width={"100%"}
            sx={{ my: 2 }}
          >
            <Box display={"flex"}>
              <Typography sx={{ pr: 4, fontSize: 22, fontWeight: 600 }}>
                Facilities
              </Typography>

              {role !== "auditor" && (
                <Button
                  sx={{
                    mx: 2,
                    color: "#EF7612",
                    borderColor: "#EF7612",
                    textTransform: "none",
                    borderRadius: "10px",
                    height: "30px",
                    "&:hover": {
                      backgroundColor: "white",
                      border: "1px solid orange",
                    },
                  }}
                  variant="outlined"
                  onClick={handleOpenFacilityForm}
                >
                  Add
                </Button>
              )}
            </Box>
            <Button
              sx={{ color: "#EF7612", textTransform: "none" }}
              onClick={handleOpenFacilitiesTable}
              disabled={!cmsData?.data.data.data?.facs?.length}
            >
              View all
            </Button>
          </Box>
          <Grid container spacing={2}>
             <FacilitySection
              isLoading={isLoading}
              facilities={cmsData?.data.data.data?.facs}
            />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContentManagement;
