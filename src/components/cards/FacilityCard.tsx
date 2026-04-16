import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
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
import { MdOutlineLocationOn, MdOutlinePhone } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import DeleteFacilityModal from "../modals/DeleteFacilityModal";
import { useAppSelector } from "../../state/store";
import NewEditFacilityForm from "../forms/NewEditFacilityForm";

const FacilityCard = ({
  id,
  primaryName,
  secondaryName,
  phoneNumber,
  address,
  speciality,
  facilityType,
  pinCode,
  status,
  imageURL,
}: {
  id: number;
  primaryName: string;
  secondaryName: string;
  phoneNumber: string;
  address: string;
  speciality: string[];
  facilityType: string;
  pinCode: string;
  status: boolean;
  imageURL: string;
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

  function stringAvatar(name: string) {
    if (!name || name.split(" ").length < 2) {
      return {
        sx: {
          bgcolor: "#fff8f0",
          color: "black",
        },
        children: "",
      };
    }

    const [firstName, lastName] = name.split(" ");
    return {
      sx: {
        bgcolor: "#fff8f0",
        color: "black",
      },
      children: `${firstName[0]}${lastName[0]}`,
    };
  }

  const facilityData = {
    id,
    primaryName,
    secondaryName,
    phoneNumber,
    address,
    speciality,
    facilityType,
    pinCode,
    status,
    imageURL,
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
      <Card
        sx={{
          maxWidth: "380px", // Make card width responsive
          borderRadius: "16px",
          height: "100%", // Set height to auto for content to adjust
          boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)",
          overflow: "hidden", // Prevent content overflow
        }}
      >
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "90%",
          }}
        >
          <Stack
            flexDirection={"column"}
            justifyContent={"space-between"}
            gap={2}
          >
            <Box display={"flex"} justifyContent={"space-between"}>
              <Stack flexDirection={"row"} gap={3}>
                <Box>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    variant="dot"
                    color={status ? "success" : "warning"}
                  >
                    <Avatar
                      src={imageURL || undefined}
                      {...(!imageURL ? stringAvatar(primaryName) : undefined )}
                    />
                  </Badge>
                </Box>
                <Stack flexDirection={"column"}>
                  <Typography
                    fontSize={16}
                    fontWeight={500}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {primaryName}
                  </Typography>
                  <Typography
                    fontSize={14}
                    color={"#6C6C6C"}
                    sx={{ textTransform: "capitalize" }}
                  >
                    {secondaryName}
                  </Typography>
                </Stack>
              </Stack>
              {role == "auditor" ? (
                ""
              ) : (
                <Box>
                  <Button
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    sx={{ minWidth: "15px", cursor: "pointer" }}
                  >
                    <CiMenuKebab color="#EF7612" />
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
            <Box display={"flex"} maxWidth={"330px"}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MdOutlinePhone color="#EF7612" />
              </Box>
              <Typography color={"grey"} sx={{ mx: 1, flexBasis: "100%" }}>
                {phoneNumber}
              </Typography>
            </Box>
            <Box display={"flex"} maxWidth={"330px"}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MdOutlineLocationOn color="#EF7612" />
              </Box>

              <Typography
                color="grey"
                align="justify"
                sx={{
                  mx: 1,
                  flexBasis: "100%",
                  whiteSpace: "normal", // Allow text to wrap to the next line
                  wordBreak: "break-word", // Ensure long words break onto the next line
                }}
              >
                {address}
              </Typography>
            </Box>
            <Box display={"flex"}>
              <Typography color={"grey"} sx={{ textTransform: "capitalize" }}>
                Speciality: {speciality.join(", ")}
              </Typography>
            </Box>
          </Stack>
          <Box display={"flex"} justifyContent={"flex-end"}>
            <Box
              sx={{
                background: "#fff8f0",
                px: 1,
                borderRadius: "10px",
                textTransform: "capitalize",
              }}
            >
              <Typography>{facilityType}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <DeleteFacilityModal
        open={isDeleteModalOpen}
        handleClose={handleDeleteModalClose}
        facilityId={id}
      />
      <NewEditFacilityForm
        open={isEditModalOpen}
        handleClose={handleEditModalClose}
        facilityId={id}
        facData={facilityData}
      />
    </Grid>
  );
};

export default FacilityCard;
