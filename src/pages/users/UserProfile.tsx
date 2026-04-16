import {
  Grid,
  Typography,
  Avatar,
  Card,
  CardContent,
  Box,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import {
  useGetUserDataRequest,
  useUnblockUser,
} from "../../services/steigenApisService";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate, formatLanguage } from "../../shared/helper";
import {
  MdOutlineBloodtype,
  MdOutlineEmail,
  MdOutlinePhone,
} from "react-icons/md";
import BlockUserModal from "../../components/modals/BlockUserModal";
import { useState } from "react";
import { toast } from "react-toastify";
import { BiArrowBack } from "react-icons/bi";
import { useAppSelector } from "../../state/store";
import { FamilyType } from "../../shared/types/user";
import ServerDownImage from "../../components/cards/serverDown";
import UserProfileSkeleton from "../../components/skeleton/userProfileSkeleton";

const cardStyle = {
  borderRadius: "10px",
  boxShadow: "none",
  backgroundColor: "#fbfbfb",
  marginBottom: "20px",
};

const InformationStyle = {
  color: "#7f7f7f",
};

const iconStyle = {
  backgroundColor: "#f5f5f5", // Background color
  borderRadius: "50%", // Makes the background circular
  padding: "8px", // Adjust padding to control the size of the circle
  display: "flex",
};

const UserProfile = () => {
  const params = useParams();
  const searchParams = new URLSearchParams(location.search);
  const type = searchParams.get("type");
  const {
    data: userData,
    isLoading,
    error,
  } = useGetUserDataRequest(params.id, type);

  const [open, setOpen] = useState(false);
  const { role } = useAppSelector((state) => state.storeUserData);

  const handleClose = () => setOpen(false);

  const handleOpenBlockModal = () => {
    setOpen(true);
  };

  const navigate = useNavigate();

  const user = userData?.data?.data;

  const { mutate } = useUnblockUser();

  const handleUnblockUser = (userId: string | undefined) => {
    mutate(
      { userId },
      {
        onSuccess: () => {
          toast.success("User unblocked");
          handleClose();
        },
        onError: () => {
          toast.error("Error unblocking user");
        },
      }
    );
  };

  const renderBlockUnblockButton = () => {
    if (user?.account?.isBlocked) {
      return (
        <Box display={"flex"} sx={{ alignItems: "center" }}>
          <Typography fontSize={14} fontWeight={500} color={"grey"} pr={2}>
            Account has been blocked
          </Typography>
          {role === "superAdmin" && (
            <Button
              variant="contained"
              type="submit"
              sx={{
                borderRadius: "10px",
                textTransform: "none",
                background:
                  "linear-gradient(90deg,rgba(255, 102, 0, 0.9), rgba(255, 102, 0, 0.6))",
                width: "110px",
              }}
              onClick={() => handleUnblockUser(params.id)}
            >
              Unblock
            </Button>
          )}
        </Box>
      );
    }

    if (type === "minor") {
      return null;
    }

    if (role === "superAdmin") {
      return (
        <Button
          variant="contained"
          type="submit"
          sx={{
            borderRadius: "10px",
            textTransform: "none",
            background:
              "linear-gradient(90deg,rgba(255, 102, 0, 0.9), rgba(255, 102, 0, 0.6))",
            width: "110px",
          }}
          onClick={handleOpenBlockModal}
        >
          Block
        </Button>
      );
    }

    return null;
  };

  if (isLoading) return <UserProfileSkeleton />;
  if (error?.message === "Network Error")
    return <ServerDownImage center={true} />;

  return (
    <>
      <BlockUserModal
        open={open}
        handleClose={handleClose}
        userId={params.id}
      />
      <Grid container spacing={3}>
        <Grid item xs={12} display={"flex"} justifyContent={"space-between"}>
          <Stack flexDirection={"row"}>
            <IconButton onClick={() => navigate("/users")} sx={{ mr: 2 }}>
              <BiArrowBack color="black" size={18} />
            </IconButton>
            <Typography fontSize={{ md: 20, lg: 24 }} color={"gray"}>
              <span style={{ color: "black" }}>
                {user?.name} - {user?.id?.toUpperCase() ?? ""}
              </span>
            </Typography>
          </Stack>
          {renderBlockUnblockButton()}
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={cardStyle}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid
                  item
                  xs={12}
                  md={3}
                  display="flex"
                  alignItems="center"
                  flexDirection={"column"}
                >
                  <Avatar
                    alt={user?.name}
                    src={user?.profileImage}
                    sx={{ width: 80, height: 80 }}
                  />
                  <Typography
                    textTransform={"capitalize"}
                    fontSize={16}
                    sx={{ pt: 1 }}
                  >
                    {user?.gender}
                  </Typography>
                </Grid>
                <Grid item xs={9}>
                  <Grid container spacing={1}>
                    <Grid item xs={12} display="flex" alignItems="center">
                      <Box style={iconStyle}>
                        <MdOutlineEmail />
                      </Box>
                      <Typography fontSize={14} sx={{ pl: 1 }}>
                        {user?.emailId ? user?.emailId : "--"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} display="flex" alignItems="center">
                      <Box style={iconStyle}>
                        <MdOutlinePhone />
                      </Box>

                      <Typography fontSize={14} sx={{ pl: 1 }}>
                        {user?.phoneNumber ? user?.phoneNumber : "---"}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} display="flex" alignItems="center">
                      <Box style={iconStyle}>
                        <MdOutlineBloodtype />
                      </Box>

                      <Typography fontSize={14} sx={{ pl: 1 }}>
                        {user?.bloodType}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card style={cardStyle}>
            <CardContent>
              <Typography fontSize={18} fontWeight={600} pb={1}>
                Account Information
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Created :
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>
                    &nbsp; {formatDate(user?.account?.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Language :
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>
                    &nbsp; {formatLanguage(user?.account?.language)}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Subscription :
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>
                    &nbsp; {user?.account?.subscription ? "Premium" : "Free"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card style={cardStyle}>
            <CardContent>
              <Typography fontSize={18} fontWeight={600} pb={1}>
                Health Information
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Family Doctor Name :
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    sx={{
                      wordBreak: "break-word", // Ensure long words break onto the next line
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    &nbsp;
                    {user?.healthRecords?.familyDoctorName
                      ? user?.healthRecords?.familyDoctorName
                      : "--"}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Doctor Address :
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    sx={{
                      wordBreak: "break-word", // Ensure long words break onto the next line
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    &nbsp;
                    {user?.healthRecords?.doctorAddress
                      ? user?.healthRecords?.doctorAddress
                      : "--"}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Disease :
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    sx={{
                      wordBreak: "break-word", // Ensure long words break onto the next line
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    &nbsp;
                    {user?.healthRecords?.disease?.length > 0
                      ? user.healthRecords.disease.join(", ")
                      : "--"}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Allergies :
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography
                    sx={{
                      wordBreak: "break-word", // Ensure long words break onto the next line
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    &nbsp;
                    {user?.healthRecords?.allergies?.length > 0
                      ? user.healthRecords.allergies.join(", ")
                      : "--"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card style={cardStyle}>
            <CardContent>
              <Typography fontSize={18} fontWeight={600} pb={1}>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Country
                  </Typography>
                  <Typography textTransform={"capitalize"}>
                    {user?.personal?.country ? user?.personal?.country : "--"}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Date of Birth
                  </Typography>
                  <Typography>{formatDate(user?.personal?.dob)}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Pincode
                  </Typography>
                  <Typography>{user?.personal?.pincode}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Emergency Contact
                  </Typography>
                  <Typography>
                    {user?.personal?.emergencyContact
                      ? user?.personal?.emergencyContact
                      : "--"}
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography color="textSecondary" style={InformationStyle}>
                    Address
                  </Typography>
                  <Typography
                    sx={{
                      wordBreak: "break-word", // Ensure long words break onto the next line
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {user?.personal?.address ? user?.personal?.address : "--"}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <Card style={cardStyle}>
            <CardContent>
              <Typography fontSize={18} fontWeight={600} pb={1}>
                Family Member
              </Typography>
              <Grid container spacing={2}>
                {user?.family.length > 0 ? (
                  user?.family?.map((member: FamilyType) => (
                    <Grid
                      item
                      key={member.name}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                    >
                      <Avatar
                        alt={member.name}
                        src={member.profileImage}
                        sx={{ width: 56, height: 56 }}
                      />
                      <Typography
                        fontSize={16}
                        mt={1}
                        sx={{
                          wordBreak: "break-word", // Ensure long words break onto the next line
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          textAlign:"center"
                        }}
                      >
                        {member.name}
                      </Typography>
                      <Typography style={InformationStyle}>
                        {member?.relation?.charAt(0).toUpperCase() +
                          member?.relation.slice(1)}
                      </Typography>
                    </Grid>
                  ))
                ) : (
                  <Grid
                    display={"flex"}
                    flexDirection={"column"}
                    alignItems={"center"}
                    height={"90px"}
                  />
                )}
              </Grid>
            </CardContent>
          </Card>
          <Card style={cardStyle}>
            <CardContent>
              <Typography fontSize={18} fontWeight={600} pb={1}>
                Additional Information
              </Typography>
              <Typography
                fontSize={16}
                sx={{
                  wordBreak: "break-word", // Ensure long words break onto the next line
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {user?.additionalInfo ? user?.additionalInfo : "--"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default UserProfile;
