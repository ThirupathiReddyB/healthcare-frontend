import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { AiFillEdit } from "react-icons/ai";
import { CiMenuKebab } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscCircleSmallFilled } from "react-icons/vsc";
import DeleteAdvertiseModal from "../modals/DeleteAdvertiseModal";
import EditAdvertiseForm from "../forms/EditAdvertiseForm";
import { useAppSelector } from "../../state/store";

const AdvertiseCard = ({
  id,
  title,
  link,
  redirectLink,
  priority,
  position,
  status,
  subscriptionType,
}: {
  id: number;
  title: string;
  link: string;
  redirectLink: string;
  priority: string;
  position: string;
  status: boolean;
  subscriptionType: string;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const { role } = useAppSelector((state) => state.storeUserData);

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
    handleClose();
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    handleClose();
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const advertiseData = {
    id,
    title,
    link,
    redirectLink,
    priority,
    position,
    status,
    subscriptionType,
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
      <Card
        sx={{
          maxWidth: "380px", // Make card width responsive
          borderRadius: "16px",
          height: "300px", // Adjust card height based on screen size
          boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden", // Prevent content overflow
        }}
      >
        <Box
          pt={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            borderRadius: "10px",

            height: { xs: "60px", sm: "80px", md: "100px" },
          }}
        >
          <CardMedia
            component="img"
            image={link}
            alt={title}
            sx={{
              borderRadius: "5px",

              width: { xs: "90%", sm: "90%", md: "95%", lg: "95%" }, // Adjust width dynamically
              height: { xs: "90%", sm: "95%", md: "100%", lg: "100%" },
              objectFit: "fill", // Ensure the image doesn't get stretched
              objectPosition: "center", // Center the image within the container
            }}
          />
        </Box>

        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            paddingBottom: "9px !important",
            height: { lg: "50%", md: "50%", sm: "55%", xs: "55%" },
            position: "relative",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              fontSize={{ xs: 14, sm: 16 }} // Adjust font size for different screen sizes
              fontWeight={500}
              noWrap
            >
              {title}
            </Typography>
            {role !== "auditor" && (
              <Box sx={{ height: "15px", position: "relative", zIndex: 100 }}>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                  sx={{ minWidth: "15px", cursor: "pointer", p: 0 }}
                >
                  <CiMenuKebab color="orange" />
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                  sx={{
                    "& .MuiPaper-root": {
                      backgroundColor: "#fff8f0",
                      borderRadius: "10px",
                    },
                  }}
                >
                  <MenuItem onClick={handleDeleteClick}>
                    <ListItemIcon>
                      <RiDeleteBin6Line color="#EF7612" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleEditClick}>
                    <ListItemIcon>
                      <AiFillEdit color="#EF7612" />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>

          <Typography
            noWrap
            color="grey"
            fontSize={{ xs: 14, sm: 16 }} // Responsive font size
          >
            {redirectLink}
          </Typography>

          <Stack flexDirection="row" alignItems="center" gap={1}>
            <Typography color="grey">{priority} priority</Typography>
            <VscCircleSmallFilled color="grey" />
            <Typography color="grey">Position {position}</Typography>
          </Stack>
          <Stack
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center" // Center align vertically
            sx={{ mt: "auto" }}
          >
            {status ? (
              <Box display="flex" alignItems="center" padding="0px">
                <VscCircleSmallFilled color="green" />
                <Typography variant="body2" color="grey">
                  Active
                </Typography>
              </Box>
            ) : (
              <Box display="flex" alignItems="center">
                <VscCircleSmallFilled color="red" />
                <Typography variant="body2" color="grey">
                  Inactive
                </Typography>
              </Box>
            )}
            <Box sx={{ background: "#fff8f0", px: 1, borderRadius: "10px" }}>
              {subscriptionType ? (
                <Typography variant="body2"> Premium</Typography>
              ) : (
                <Typography variant="body2">For Free</Typography>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <DeleteAdvertiseModal
        open={isDeleteModalOpen}
        handleClose={handleDeleteModalClose}
        advertiseId={id}
      />
      <EditAdvertiseForm
        open={isEditModalOpen}
        handleClose={handleEditModalClose}
        advertiseId={id}
        advData={advertiseData}
      />
    </Grid>
  );
};

export default AdvertiseCard;
