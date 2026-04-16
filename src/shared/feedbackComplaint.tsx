import { Avatar, Box, Typography } from "@mui/material";
import { getInitials } from "./helper";

//formatDate for user feedback and complaints
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "numeric",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

//avatar component
export const UserAvatar = (
  fullName: string,
  profileImage: any,
  isRead: boolean
) => {
  return (
    <Avatar
      alt={fullName}
      src={profileImage}
      sx={{
        color: isRead ? "#A1A1A1" : "#EF7612",
        fontSize: 16,
        width: 45, // Adjust the width of the avatar
        height: 42,
        bgcolor: "#F6F6F6",
        fontWeight: "550",
        filter: isRead ? "grayscale(50%)" : "none",
      }}
    >
      {getInitials(fullName)}
    </Avatar>
  );
};

//date component
export const complaintFeedbackDate = (createdAt: string, isRead: boolean) => {
  return (
    <Typography
      fontSize={16}
      fontWeight={550}
      sx={{
        color: isRead ? "#A1A1A1" : "#303030",
      }}
    >
      {formatDate(createdAt)}
    </Typography>
  );
};

//header of each complaint and feedback
export const complaintFeedbackHeader = (
  fullName: string,
  userId: string,
  isRead: boolean,
  shownCN: boolean,
  complaintId?: string
) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      sx={{ color: isRead ? "#A1A1A1" : "#303030" }}
    >
      <Box display={"flex"} flexDirection={"row"} pb={"5px"}>
        <Typography
          fontSize={16}
          fontWeight={500}
          // sx={{ color: isRead ? "#A1A1A1" : "#303030" }}
        >
          {fullName}&nbsp;-
        </Typography>
        <Typography
          fontSize={16}
          fontWeight={500}
          // sx={{ color: isRead ? "#A1A1A1" : "#303030" }}
        >
          &nbsp;{userId.toUpperCase()}
        </Typography>
      </Box>
      {shownCN ? (
        <Box>
          <Typography fontSize={16} fontWeight={500}>
            CN : {complaintId}
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

//user message




export const userMesssage = (message: string, isRead: boolean) => {
  return (
    <Typography
      fontSize={16}
      fontWeight={500}
      align={"justify"}
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        color: isRead ? "#A1A1A1" : "#303030",
        display: "-webkit-box",
        WebkitLineClamp: "3", // Ensures only two lines are shown
        WebkitBoxOrient: "vertical",
        wordBreak: "break-word", // Ensure long words break onto the next line
      }}
    >
      {message}
    </Typography>
  );
};

export const userMesssageInDetail = (message: string, isRead: boolean) => {
  return (
    <Typography
      fontSize={16}
      fontWeight={500}
      align={"justify"}
      sx={{
        wordBreak: "break-word", // Ensure long words break onto the next line
        color: isRead ? "#A1A1A1" : "#303030",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
      }}
    >
      {message}
    </Typography>
  );
};
