import { Box, Stack, Typography } from "@mui/material";
import { useGetAllFeedbackComplaintDataRequest } from "../../services/steigenApisService";
import { useLocation, useNavigate } from "react-router-dom";
import { AntTab, AntTabs } from "../layout/RootLayout";
import { MessageSkeleton } from "../../components/skeleton/userMessageSkeleton";
import NoDataImage from "../../components/cards/NoDataImage";
import { FeedBackComplaint } from "../../shared/types/feedbackComplaint";
import ServerDownImage from "../../components/cards/serverDown";
import CustomPagination from "../../components/tables/pagination/CustomPagination";
import { useEffect, useState } from "react";
import {
  complaintFeedbackDate,
  complaintFeedbackHeader,
  UserAvatar,
  userMesssage,
} from "../../shared/feedbackComplaint";
import GoToTop from "../../shared/goToTop";
import { useDispatch } from "react-redux";
import { storePageData } from "../../state/user/pageSlice";
import { useAppSelector } from "../../state/store";

const Feedback = () => {
  const pageSize = 10;

  const { pageNumber } = useAppSelector((state) => state.storePageData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const {
    data: fetchedData,
    isLoading,
    isFetching,
    error,
  } = useGetAllFeedbackComplaintDataRequest(pageNumber, pageSize);

  const isFeedbackOrComplaint =
    location.pathname.includes("/feedback") ||
    location.pathname.includes("/complaint");
  useEffect(() => {
    if (fetchedData) {
      setTotalCount(fetchedData.data.data.totalRecords.feedback);
      setData(fetchedData.data.data?.feedbacks);
    }
  }, [fetchedData]);

  const handleFeedbackClick = (feedback: FeedBackComplaint) => {
    navigate(`${feedback.id}`, { state: { feedback } });
  };
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };
  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (newPage > page && newPage === totalPages) {
      setPage((prevPage) => prevPage + 1);
      dispatch(
        storePageData({
          pageNumber: pageNumber + 1,
        })
      );
    }
    setPage(newPage);
    dispatch(
      storePageData({
        pageNumber: newPage,
      })
    );
  };
  if (isLoading || isFetching) return <MessageSkeleton />;

  if(error?.message === "Network Error") return <ServerDownImage center={true}/>;

  return (
    <Box>
      <Box display={"flex"}>
        {isFeedbackOrComplaint && (
          <AntTabs
            value={location.pathname}
            onChange={handleTabChange}
            aria-label="ant example"
          >
            <AntTab label="Complaints" value="/complaint" />
            <AntTab label="Feedback" value="/feedback" />
          </AntTabs>
        )}
      </Box>
      <Box display={"flex"} justifyContent={"space-between"} my={2} ml={2}>
        <Typography
          sx={{ fontSize: 23, fontWeight: 500, fontFamily: "Urbanist", py: 1 }}
        >
          Feedback List
        </Typography>

        <CustomPagination
          currentPage={pageNumber}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Box>

      <Stack
        flexDirection={"column"}
        justifyContent={"space-between"}
        gap={2}
        mt={5}
        ml={2}
      >
        {data?.length > 0 ? (
          data?.map((feedback: FeedBackComplaint) => (
            <Box key={feedback.id}>
              <Box
                mb={4}
                onClick={() => handleFeedbackClick(feedback)}
                style={{ cursor: "pointer" }}
              >
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Stack flexDirection={"row"} gap={3}>
                    <Box>
                      {UserAvatar(
                        feedback?.user.fullName,
                        feedback?.user.profileImage,
                        feedback.isRead
                      )}
                    </Box>
                    <Box display={"flex"} alignItems={"center"}>
                      {complaintFeedbackHeader(
                        feedback.user.fullName,
                        feedback.user.id.toUpperCase(),
                        feedback.isRead,
                        false
                      )}
                    </Box>
                  </Stack>
                  <Box>
                    <Typography fontSize={16} fontWeight={500}>
                      {complaintFeedbackDate(
                        feedback.createdAt,
                        feedback.isRead
                      )}{" "}
                    </Typography>
                  </Box>
                </Box>
                <Box mt={3}>
                  <Typography fontSize={16} fontWeight={500} align={"justify"}>
                    {userMesssage(feedback.message, feedback.isRead)}
                  </Typography>
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
      </Stack>
      <GoToTop />
    </Box>
  );
};

export default Feedback;
