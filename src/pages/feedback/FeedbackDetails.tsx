import { Box, Stack, Typography, IconButton, Card } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { formatDateComplaintFeedback } from "../../shared/helper";
import { getComplainById } from "../../services/steigenApisService";
import {
  complaintFeedbackHeader,
  UserAvatar,
} from "../../shared/feedbackComplaint";
import { useAppSelector } from "../../state/store";

const FeedbackDetails = () => {
  const { role } = useAppSelector((state) => state.storeUserData);
  const location = useLocation();
  const navigate = useNavigate();

  const feedback = location.state.feedback;

  const { data: fetchedData } = getComplainById(
    feedback.id,
    feedback.messageType,
    role !== "auditor"
  );

  if (!fetchedData) {
    return <Typography>No feedback found.</Typography>;
  }

  return (
    <Card
      sx={{
        p: "10px",
        borderRadius: "16px",
        boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box px={4}>
        <IconButton onClick={() => navigate("/feedback")}>
          <BiArrowBack color="black" size={25} />
        </IconButton>
        <Box display={"flex"} justifyContent={"space-between"} mt={4} ml={2}>
          <Stack flexDirection={"row"} gap={3} alignItems={"center"}>
            <Box>
              {UserAvatar(
                feedback?.user.fullName,
                feedback?.user.profileImage,
                false
              )}
            </Box>
            {complaintFeedbackHeader(
              feedback.user.fullName,
              feedback.user.id.toUpperCase(),
              false,
              false
            )}
          </Stack>
          <Box>
            <Typography
              fontSize={14}
              fontWeight={550}
              sx={{
                color: "#303030",
              }}
            >
              {" "}
              {formatDateComplaintFeedback(feedback.createdAt).replaceAll(
                ",",
                ""
              )}
            </Typography>
          </Box>
        </Box>
        <Box mt={5} ml={2}>
          <Typography
            fontSize={16}
            fontWeight={500}
            pb={"30px"}
            display={"flex"}
            justifyContent={"space-between"}
            align={"justify"}
          >
            {feedback.message}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default FeedbackDetails;
