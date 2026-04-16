import {
  Box,
  IconButton,
  Stack,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Card,

} from "@mui/material";
import React, { useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useLocation, useNavigate } from "react-router-dom";
import { RiSendPlane2Line } from "react-icons/ri";
import {
  getComplainById,
  useReplyComplaint,
} from "../../services/steigenApisService";
import { toast } from "react-toastify";
import { useAppSelector } from "../../state/store";
import { formatDateComplaintFeedback } from "../../shared/helper";
import {
  complaintFeedbackHeader,
  UserAvatar,
  userMesssageInDetail,
} from "../../shared/feedbackComplaint";

const ComplaintDetails = () => {
  const { role, email } = useAppSelector((state) => state.storeUserData);
  const navigate = useNavigate();
  const location = useLocation();
  const complaint = location.state.complaint;
  const [repliedBy, setRepliedBy] = useState(complaint?.replyBy);
  const [reply, setReply] = useState(complaint?.reply);
  const [error, setError] = useState("");

  //api's
  getComplainById(complaint.id, complaint.messageType, role !== "auditor"); // mark data as read if not auditor
  const { mutate, isPending } = useReplyComplaint(); // send the reply

  if (!complaint) {
    return <Typography>No complaint found.</Typography>;
  }

  const handleReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReply(event.target.value);
  };
  


  const handleSubmit = () => {
    const trimmedReply = reply?.trim();

    // Manual validation
    if (trimmedReply?.length < 1) {
      setError("Reply should have at least one character");
      return;
    }
  
    if (trimmedReply?.length > 2000) {
      setError("Reply can be at most 2000 characters long");
      return;
    }
  
    setError(""); // Clear any previous errors
  
    mutate(
      { complaintId: complaint.id, reply: reply },
      {
        onSuccess: () => {
          setRepliedBy(email);
          toast.success("Reply sent to the concerned user");
        },
        onError: () => {
          toast.error("Reply failed");
        },
      }
    );

  };

  return (

    <Card
      sx={{
        p: "10px",
        borderRadius: "16px",
        boxShadow: "0 0px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box px={4}>
        <Box display={"flex"} justifyContent={"space-between"} mt={3} ml={2}>
          <IconButton onClick={() => navigate("/complaint")}>
            <BiArrowBack color="black" size={25} />
          </IconButton>
          
        </Box>
        <Box display={"flex"} justifyContent={"space-between"} mt={3} ml={2}>
          <Stack flexDirection={"row"} gap={3} alignItems={"center"}>
            <Box>
              {UserAvatar(
                complaint?.user.fullName,
                complaint?.user.profileImage,
                false
              )}
            </Box>
            {complaintFeedbackHeader(
              complaint.user.fullName,
              complaint.user.id.toUpperCase(),
              false,
              true,
              complaint.complaintId.toString()
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
              {formatDateComplaintFeedback(complaint.createdAt).replaceAll(
                ",",
                ""
              )}
            </Typography>
          </Box>
        </Box>
        <Box mt={4} ml={2}>
          <Typography fontSize={16} fontWeight={500} align={"justify"}>
            {userMesssageInDetail(complaint.message, false)}
          </Typography>
        </Box>
        <Box mt={2} ml={2}>
          {repliedBy ? (
            <div
              style={{
                backgroundColor: "#fff8f0",
                padding: "10px",
                borderRadius: "12px",
                marginTop: "20px",
              }}
            >
              <Typography fontSize={16} fontWeight={500}>
                {reply}
              </Typography>
              <Typography
                color="textSecondary"
                sx={{ mt: "40px " }}
                fontSize={14}
                fontWeight={400}
                justifyContent={"end"}
              >
                Reply by {repliedBy}
              </Typography>
            </div>
          ) : role !== "auditor" &&
           (
            <div>
              <Box>
              <TextField
                placeholder="Reply.."
                multiline
                rows={10}
                variant="standard"
                fullWidth
                value={reply}
                onChange={handleReplyChange}
                InputProps={{
                  disableUnderline: true,
                }}
                error={!!error}
                // helperText={error}
                sx={{
                  backgroundColor: "#fff8f0",
                  borderRadius: "10px",
                  p: "10px",
                }}
                
              />
               {error && (
                <Typography color="error" fontSize={12} mt={1}>
                  {error}
                </Typography>
              )}
              </Box>
              <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
                <Button
                  variant="contained"
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isPending}
                  sx={{
                    borderRadius: "10px",
                    textTransform: "none",
                    background:
                      "linear-gradient(90deg,rgba(255, 102, 0, 0.9), rgba(255, 102, 0, 0.6))",
                  }}
                >
                  {isPending ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <RiSendPlane2Line color="white" size={25} />
                  )}
                </Button>
              </Box>
            </div>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default ComplaintDetails;
