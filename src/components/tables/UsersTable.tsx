import React, { useState, useEffect } from "react";
import {
  GridColDef,
  GridEventListener,
  GridRenderCellParams,
  GridRowParams,
  GridSortModel,
} from "@mui/x-data-grid";
import { Avatar, Box, Stack, TextField, Typography } from "@mui/material";
import { getInitials } from "../../shared/helper";
import { useGetAllUsersDataRequest } from "../../services/steigenApisService";
import CustomPagination from "./pagination/CustomPagination";
import { useNavigate } from "react-router-dom";
import InputAdornment from "@mui/material/InputAdornment";
import { IoSearch } from "react-icons/io5";
import { erasePageData, storePageData } from "../../state/user/pageSlice";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../state/store";
import GoToTop from "../../shared/goToTop";
import UsersTableContent from "./UserTableContent";

interface User {
  id: number;
  fullName: string;
  uid: string;
  gender: string;
  country: string;
  pincode: string;
  isBlocked: boolean;
  avatar: string;
}

const UsersTable: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const { pageNumber } = useAppSelector((state) => state.storePageData);
  const pageSize = 50;
  const [sequence, setSequence] = useState<{ field: any; order: any }>({
    field: "createdAt",
    order: "desc",
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [data, setData] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const dispatch = useDispatch();
  const {
    data: fetchedData,
    isLoading,
    isFetching,
    error,
  } = useGetAllUsersDataRequest(
    debouncedSearch,
    sequence.field,
    sequence.order
  );

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
        setSequence({ field: "createdAt", order: "desc" });
        setSortModel(newSortModel);
        localStorage.setItem(
          "sortTableBy",
          JSON.stringify({ field: "createdAt", order: "desc" })
        );
      }
    },
    []
  );

  useEffect(() => {
    const savedSort = localStorage.getItem("sortTableBy");
    if (savedSort) {
      const parsedSort = JSON.parse(savedSort);
      setSequence(parsedSort);
    }
    if (fetchedData) {
      setData(fetchedData.data.data);
      setTotalCount(fetchedData.data.totalRecords);
    }
  }, [fetchedData, sequence]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 900);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const cols: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      hideable: false,
      filterable: false,
      minWidth: 200,

      renderCell: (param: GridRenderCellParams) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar alt={param.row.fullName} src={param.row.profileImage}>
            {!param.row.avatar && getInitials(param.row.fullName)}
          </Avatar>{" "}
          &nbsp; &nbsp;
          <Typography
            textTransform={"capitalize"}
            sx={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {param.row.fullName}
          </Typography>
        </div>
      ),
    },
    {
      field: "id",
      headerName: "UID",
      flex: 0.7,
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      minWidth: 100,

      renderCell: (param: GridRenderCellParams) => (
        <Typography
          textTransform={"uppercase"}
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {param.row.id}
        </Typography>
      ),
    },
    {
      field: "gender",
      headerName: "Gender",
      sortable: false,
      minWidth: 100,
      hideSortIcons: true,
      disableColumnMenu: true,
      flex: 0.5,
      renderCell: (param: GridRenderCellParams) => (
        <Typography
          textTransform={"capitalize"}
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {param.row.gender}
        </Typography>
      ),
    },
    {
      field: "verifiedContactId",
      headerName: "Contact",
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      minWidth: 100,

      flex: 1,
      renderCell: (param: GridRenderCellParams) => (
        <Typography
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {param.row.verifiedContactId === "phoneNumber"
            ? param.row.phoneNumber
            : param.row.emailId}
        </Typography>
      ),
    },
    {
      field: "country",
      headerName: "Country",
      sortable: false,

      hideSortIcons: true,
      disableColumnMenu: true,
      flex: 0.5,
      minWidth: 150,
      renderCell: (param: GridRenderCellParams) => (
        <Typography
          textTransform={"capitalize"}
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {param.row.country}
        </Typography>
      ),
    },
    {
      field: "pincode",
      headerName: "Pin code",
      sortable: false,
      minWidth: 80,

      hideSortIcons: true,
      disableColumnMenu: true,
      flex: 0.5,
    },
    {
      field: "type",
      headerName: "User",
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      minWidth: 80,
      flex: 0.5,
      renderCell: (param: GridRenderCellParams) => (
        <Typography
          textTransform={"capitalize"}
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          {param.row.type === "user" ? "Primary" : "Minor"}
        </Typography>
      ),
    },
    {
      field: "isBlocked",
      headerName: "Account",
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      flex: 0.5,
      minWidth: 80,
      renderCell: (param: GridRenderCellParams) => (
        <Typography
          textTransform={"capitalize"}
          sx={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            height: "100%",
            color: param.row.isBlocked ? "red" : "gray",
          }}
        >
          {param.row.isBlocked ? "Blocked" : "In Use"}
        </Typography>
      ),
    },
  ];

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

  const handleRowClick: GridEventListener<"rowClick"> = (
    param: GridRowParams
  ) => {
    navigate(`/users/${param.id}?type=${param.row.type}`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    dispatch(erasePageData());
  };

  return (
    <div style={{ overflowX: "hidden" }}>
      <Box display={"flex"} justifyContent={"space-between"} my={2}>
        <Stack flexDirection={"row"} my={1}>
          <TextField
            sx={{
              background: "#f5f5f5",
              width: { xs: "100%", sm: "300px", md: "379px" },
            }}
            autoComplete="off"
            placeholder="Search here"
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
        </Stack>
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
      >
        <UsersTableContent
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          data={data}
          pageNumber={pageNumber}
          pageSize={pageSize}
          totalCount={totalCount}
          cols={cols}
          handleSortModelChange={handleSortModelChange}
          sortModel={sortModel}
          handleRowClick={handleRowClick}
        />
      </Stack>

      {/* GoToTop Button Component */}
      <GoToTop />
    </div>
  );
};

export default UsersTable;
