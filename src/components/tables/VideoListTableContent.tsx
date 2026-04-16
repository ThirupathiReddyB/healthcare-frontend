import { GridColDef, GridSortModel, DataGrid } from "@mui/x-data-grid";
import ServerDownImage from "../cards/serverDown";
import { VideoSkeleton } from "../skeleton/contentSkeleton";

const VideoTableContent = ({
  error,
  isLoading,
  isFetching,
  cmsData,
  fetchedData,
  cols,
  totalCount,
  handleSortModelChange,
  sortModel,
  dataGridStyles,
}: {
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  cmsData: any;
  fetchedData: any;
  cols: GridColDef[];
  totalCount: number;
  handleSortModelChange: (newSortModel: GridSortModel) => void;
  sortModel: GridSortModel;
  dataGridStyles: object;
}) => {
  if (error?.message === "Network Error") {
    return <ServerDownImage />;
  }

  if (isLoading || isFetching) {
    return <VideoSkeleton />;
  }

  return (
    <DataGrid
      rows={cmsData.videos ? cmsData.videos : fetchedData?.data.data.data}
      columns={cols}
      rowCount={totalCount}
      disableRowSelectionOnClick
      paginationMode="server"
      sortingMode="server"
      onSortModelChange={handleSortModelChange}
      sortModel={sortModel}
      sx={{ ...dataGridStyles, height: "auto" }}
    />
  );
};

export default VideoTableContent;
