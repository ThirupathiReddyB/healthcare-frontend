import { Box, Stack, Typography } from "@mui/material";
import { useGetAllFeedbackComplaintDataRequest } from "../../services/steigenApisService";
import { useLocation, useNavigate } from "react-router-dom";
import { AntTab, AntTabs } from "../layout/RootLayout";
import { MessageSkeleton } from "../../components/skeleton/userMessageSkeleton";
import { FeedBackComplaint } from "../../shared/types/feedbackComplaint";
import CustomPagination from "../../components/tables/pagination/CustomPagination";
import { useEffect, useState } from "react";
import superjson from "superjson";
import GoToTop from "../../shared/goToTop";
import { useDispatch } from "react-redux";
import { storePageData } from "../../state/user/pageSlice";
import { useAppSelector } from "../../state/store";
import ComplaintList from "./ComplaintList";

const Complaint = () => {
  const location = useLocation();
  const { pageNumber } = useAppSelector((state) => state.storePageData);
  const pageSize = 10;
  const [page, setPage] = useState(1);
  const [data, setData] = useState<[]>();
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isFeedbackOrComplaint =
    location.pathname.includes("/feedback") ||
    location.pathname.includes("/complaint");

  const {
    data: complaintData,
    isLoading,
    error,
    isFetching,
  } = useGetAllFeedbackComplaintDataRequest(pageNumber, pageSize);

  useEffect(() => {
    console.log("fetched data in complaints ", complaintData);
    if (complaintData?.data) {
      const deserializedData: any = superjson.deserialize(
        complaintData.data.data.complaints
      );
      setTotalCount(complaintData.data.data.totalRecords.complaint);
      setData(deserializedData);
    }
  }, [complaintData]);

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

  const handleComplaintClick = (complaint: FeedBackComplaint) => {
    navigate(`${complaint.id}`, { state: { complaint } });
  };
  const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  if (isLoading) return <MessageSkeleton />;
  return (
    <Box>
      <Box display={"flex"} marginTop={"0px"}>
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
          Complaint List
        </Typography>

        <CustomPagination
          currentPage={pageNumber}
          totalCount={totalCount}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />
      </Box>

      {/* <Stack
        flexDirection={"column"}
        justifyContent={"space-between"}
        gap={2}
        mt={5}
        ml={2}
      >
        {error?.message == "Network Error" ? (
          <ServerDownImage />
        ) : isLoading || isFetching ? (
          <MessageSkeleton />
        ) : data && data?.length > 0 ? (
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
                    {complaintFeedbackDate(
                      complaint.createdAt,
                      complaint.isRead
                    )}
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
      </Stack> */}
      
      <Stack
        flexDirection={"column"}
        justifyContent={"space-between"}
        gap={2}
        mt={5}
        ml={2}
      >
        <ComplaintList
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          data={data}
          handleComplaintClick={handleComplaintClick}
        />
      </Stack>
      <GoToTop />
    </Box>
  );
};

export default Complaint;
