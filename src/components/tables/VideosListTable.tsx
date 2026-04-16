import {
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import CustomPagination from "./pagination/CustomPagination";
import {
  useDeleteVideotDataRequest,
  useGetAllVideoListDataRequest,
  useRefreshVideoListDataRequest,
} from "../../services/steigenApisService";
import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AiFillEdit, RiDeleteBin6Line } from "../../assets/icons";
import DeleteModal from "../modals/DeleteVideoModal";
import VideoEditForm from "../forms/VideoEditForm";
import { toast } from "react-toastify";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import VideoAddForm from "../forms/VideoAddForm";
import { useAppSelector } from "../../state/store";
import { VideoData } from "../../shared/types/contentManagement";
import { IoSearch } from "react-icons/io5";
import { AxiosError } from "axios";
import { dataGridStyles } from "../../shared/constants";
import { useDispatch } from "react-redux";
import { erasePageData, storePageData } from "../../state/user/pageSlice";
import GoToTop from "../../shared/goToTop";
import { MdRefresh } from "react-icons/md";
import VideoTableContent from "./VideoListTableContent";

interface Video {
  id: number;
  vidName: string;
  vidSourceUrl: string;
  isSubscribed: boolean;
  priority: number;
  isActive: boolean;
}

const VideosListTable = ({
  pagination,
  cmsData,
}: {
  pagination: boolean;
  cmsData: any;
}) => {
  const dispatch = useDispatch();

  const { pageNumber } = useAppSelector((state) => state.storePageData);
  const navigate = useNavigate();
  const pageSize = 10;
  const [data, setData] = useState<Video[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [sequence, setSequence] = useState<{ field: any; order: any }>({
    field: "priority",
    order: "asc",
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const {
    data: fetchedData,
    isLoading,
    error,
    isFetching,
  } = useGetAllVideoListDataRequest(
    pageNumber,
    pageSize,
    debouncedSearch,
    sequence.field,
    sequence.order
  );
  const { mutate: deleteVideo } = useDeleteVideotDataRequest();
  const mobileResponsiveScreen = useMediaQuery("(min-width:1039px)");

  const [open, setOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);
  const [selectedVideoData, setSelectedVideoData] = useState<Video | null>(
    null
  );
  const { role } = useAppSelector((state) => state.storeUserData);
  const [openAdd, setOpenAdd] = useState(false);
  const handleOpenVideoForm = () => {
    setOpenAdd(true);
  };
  const handleClose = () => setOpenAdd(false);

  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    const savedSort = localStorage.getItem("sortTableBy");
    if (savedSort) {
      const parsedSort = JSON.parse(savedSort);
      setSequence(parsedSort);
    }
    if (fetchedData) {
      setTotalCount(fetchedData.data.data.totalRecords);
    }
  }, [fetchedData, sequence]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { mutate: refreshVideos, isPending: isRefreshing } =
    useRefreshVideoListDataRequest();

  const handleRefresh = () => {
    refreshVideos( undefined, {
      onSuccess: () => {
        toast.success("Videos refreshed successfully");
      },
      onError: (err: AxiosError) => {
        toast.error("Failed to refresh videos");
        console.error(err);
      },
    });
  };

  const handleSortModelChange = React.useCallback(
    (newSortModel: GridSortModel) => {
      if (newSortModel.length > 0) {
        const { field, sort } = newSortModel[0];
        setSequence({ field, order: sort });
        setSortModel(newSortModel);
        localStorage.setItem(
          "sortTableBy",
          JSON.stringify({ field, order: sort })
        );
        dispatch(erasePageData());
      } else {
        setSequence({ field: "priority", order: "asc" });
        setSortModel(newSortModel);
        localStorage.setItem(
          "sortTableBy",
          JSON.stringify({ field: "priority", order: "asc" })
        );
      }
    },
    []
  );
  const handleCloseEditForm = () => {
    setSelectedVideoId(null);
    setSelectedVideoData(null);
    setOpenEdit(false);
  };

  const handleOpenEditForm = (id: number) => {
    const videoData = cmsData.videos
      ? cmsData.videos
      : fetchedData?.data.data.data;
    const video = videoData.find((video: Video) => video.id === id);
    setSelectedVideoId(id);
    setSelectedVideoData(video);
    setOpenEdit(true);
  };
  const handleOpenDeleteForm = (id: number) => {
    setSelectedVideoId(id);
    setOpen(true);
  };

  const handleCloseDeleteForm = () => {
    setSelectedVideoId(null);
    setOpen(false);
  };

  const handleDelete = () => {
    if (selectedVideoId !== null) {
      deleteVideo(
        { videoId: selectedVideoId },
        {
          onSuccess: () => {
            setData(data.filter((video) => video.id !== selectedVideoId));
            setTotalCount((prevCount) => prevCount - 1);
            handleCloseDeleteForm();
            toast.success("Video deleted successfully");
          },
          onError: (err: AxiosError) => {
            if (
              err?.response?.status === 500 ||
              err?.response?.status === 502
            ) {
              toast.error("Server error");
            } else if (err?.response?.status === 404) {
              toast.error("The video you are trying to delete does not exist.");
            } else {
              console.log(err);
              toast.error("Error occurred while deleting video");
            }
          },
        }
      );
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    dispatch(erasePageData());
  };

  const cols: GridColDef[] = [
    {
      field: "serialNumber",
      headerName: "Sr.No",
      flex: 0.5,
      minWidth: 50,
      filterable: false,
      sortable: false,
      disableColumnMenu: true,
    },
    {
      field: "vidName",
      headerName: "Name",
      flex: 1,
      minWidth: 150,
      hideable: false,
      filterable: false,
    },
    {
      field: "vidSourceUrl",
      headerName: "Preview",
      flex: 1,
      minWidth: 220,
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
    },
    {
      field: "isSubscribed",
      headerName: "Subscription Type",
      flex: 0.7,
      minWidth: 150,
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      renderCell: (param: GridRenderCellParams) => (
        <div>{param.row.isSubscribed ? "Premium" : "Free"}</div>
      ),
    },
    {
      field: "priority",
      headerName: "Priority no.",
      flex: 0.5,
      minWidth: 120,
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 130,
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      renderCell: (param: GridRenderCellParams) => (
        <div>{param.row.isActive ? "Active" : "Inactive"}</div>
      ),
    },
    {
      field: "actions",
      headerName: "Action",
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return role == "auditor" ? (
          <div style={{ color: "Gray" }}>No Access</div>
        ) : (
          <Stack direction={"row"} gap={1} pt={2}>
            <AiFillEdit
              color="#EF7612"
              onClick={() => handleOpenEditForm(params.row.id)}
              style={{ cursor: "pointer" }}
            />
            <RiDeleteBin6Line
              color="#EF7612"
              onClick={() => handleOpenDeleteForm(params.row.id)}
              style={{ cursor: "pointer" }}
            />
          </Stack>
        );
      },
    },
  ];

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(totalCount / pageSize);
    if (newPage > pageNumber && newPage === totalPages) {
      dispatch(
        storePageData({
          pageNumber: pageNumber + 1,
        })
      );
    }
    dispatch(
      storePageData({
        pageNumber: newPage,
      })
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <DeleteModal
        open={open}
        handleClose={handleCloseDeleteForm}
        handleDelete={handleDelete}
      />
      <VideoEditForm
        openEdit={openEdit}
        handleCloseEditForm={handleCloseEditForm}
        videoData={selectedVideoData as unknown as VideoData}
      />
      <VideoAddForm open={openAdd} handleClose={handleClose} />
      {pagination && (
        <Box my={2}>
          <Stack flexDirection={"row"} my={1}>
            <Box display={"flex"} alignItems={"center"}>
              <IconButton onClick={() => navigate("/contentmanagement")}>
                <BiArrowBack color="black" size={20} />
              </IconButton>
              <Typography sx={{ pl: 2, fontSize: 22, fontWeight: 600 }}>
                Video List
              </Typography>
            </Box>
          </Stack>

          <Box display={"flex"} justifyContent={"space-between"} my={2} flexDirection={mobileResponsiveScreen? "row" : "column"}>
            <Stack flexDirection={"row"}>
              <TextField
                sx={{
                  background: "#f5f5f5",
                  width: { xs: "100%", sm: "300px", md: "379px" },
                }}
                placeholder="Search here"
                autoComplete="off"
                variant="outlined"
                size="small"
                value={search}
                onChange={handleSearchChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IoSearch color="black" />
                    </InputAdornment>
                  ),
                }}
              />
              {role == "auditor" ? (
                ""
              ) : (
                <Button
                  sx={{
                    mx: 2,
                    color: "#EF7612",
                    borderColor: "#EF7612",
                    textTransform: "none",
                    borderRadius: "10px",
                    height: "40px",
                    width: "90px",
                    "&:hover": {
                      backgroundColor: "white",
                      border: "1px solid orange",
                    },
                  }}
                  variant="outlined"
                  onClick={handleOpenVideoForm}
                >
                  Add
                </Button>
              )}
            </Stack>
            <Box display={"flex"} gap={1} mt={mobileResponsiveScreen ? 0: 2}>
            {role !== "auditor" && (
              <Tooltip title="Refresh">
              <Button
                disableRipple
                sx={{
                  minWidth: "20px",
                  borderRadius: "50px",
                  color: "#EF7612",
                  border: "none",
                  backgroundColor: "white",
                  "&:hover, &:focus": {
                    backgroundColor: "white",
                    border: "none",
                  },
                }}
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                {isRefreshing ? <CircularProgress size={20} sx={{color: "#EF7612"}} /> : <MdRefresh  size={24}/>}
              </Button>
              </Tooltip>
            )}
              <CustomPagination
              currentPage={pageNumber}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            />
            </Box>
           
          </Box>
        </Box>
      )}
      <VideoTableContent
        error={error}
        isLoading={isLoading}
        isFetching={isFetching}
        cmsData={cmsData}
        fetchedData={fetchedData}
        cols={cols}
        totalCount={totalCount}
        handleSortModelChange={handleSortModelChange}
        sortModel={sortModel}
        dataGridStyles={dataGridStyles}
      />

      {pagination && <GoToTop />}
    </div>
  );
};

export default VideosListTable;
