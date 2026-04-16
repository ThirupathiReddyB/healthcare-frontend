import { Stack, Box, Chip } from "@mui/material";
import NoDataImage from "../../components/cards/NoDataImage";
import ServerDownImage from "../../components/cards/serverDown";
import { MessageSkeleton } from "../../components/skeleton/userMessageSkeleton";
import {
  UserAvatar,
  complaintFeedbackHeader,
  complaintFeedbackDate,
  userMesssage,
} from "../../shared/feedbackComplaint";
import { FeedBackComplaint } from "../../shared/types/feedbackComplaint";

interface ComplaintListProps {
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  data: any;
  handleComplaintClick: (complaint: FeedBackComplaint) => void;
}

const ComplaintList = ({
  error,
  isLoading,
  isFetching,
  data,
  handleComplaintClick,
}: ComplaintListProps) => {
  if (error?.message === "Network Error") {
    return <ServerDownImage />;
  }

  if (isLoading || isFetching) {
    return <MessageSkeleton />;
  }

  return (
    <>
      {data && data?.length > 0 ? (
        data?.map((complaint: FeedBackComplaint) => (
          <Box key={complaint.id}>
            <Box
              mb={4}
              onClick={() => handleComplaintClick(complaint)}
              style={{ cursor: "pointer" }}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Stack flexDirection={"row"} gap={3} alignItems={"center"}>
                  <Box>
                    {UserAvatar(
                      complaint?.user.fullName,
                      complaint?.user.profileImage,
                      complaint.isRead
                    )}
                  </Box>

                  {complaintFeedbackHeader(
                    complaint.user.fullName,
                    complaint.user.id.toUpperCase(),
                    complaint.isRead,
                    true,
                    complaint.complaintId.toString()
                  )}
                </Stack>

                <Box
                  display={"flex"}
                  flexDirection={"row"}
                  alignItems={"center"}
                  gap={2}
                >
                  {complaint.isReplied ? (
                    <Chip
                      label="Replied"
                      sx={{
                        borderRadius: "10px",
                        width: "86px",
                        bgcolor: "#FFF9F3",
                        color: "#EF7612",
                        fontWeight: "550",
                        fontSize: "14px",
                      }}
                    />
                  ) : null}
                  {complaintFeedbackDate(complaint.createdAt, complaint.isRead)}
                </Box>
              </Box>
              <Box mt={3}>
                {userMesssage(complaint.message, complaint.isRead)}
              </Box>
            </Box>
            <Box
              component="hr"
              sx={{
                border: 0,
                height: "0.7px", // Thickness of the line
                backgroundColor: "#C0C0C0", // Line color
              }}
            />
          </Box>
        ))
      ) : (
        <NoDataImage />
      )}
    </>
  );
};

export default ComplaintList;
