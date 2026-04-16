import { Box } from "@mui/material";
import VideosListTable from "../../components/tables/VideosListTable";
import { useGetAllVideoListDataRequest } from "../../services/steigenApisService";
import NoContentCard from "../../components/cards/NoContentCard";

const VideosList = () => {
  const page = 1;
  const pageSize = 10;
  const search = "";
  const sortByField = "priority";
  const sortByOrder = "asc";
  const { data: fetchedData } = useGetAllVideoListDataRequest(
    page,
    pageSize,
    search,
    sortByField,
    sortByOrder
  );

  return (
    <Box>
      {fetchedData?.data.data.data ? (
        <VideosListTable
          pagination={true}
          cmsData={fetchedData?.data.data.data}
        />
      ) : (
        <NoContentCard contentType="Videos" />
      )}
    </Box>
  );
};

export default VideosList;
