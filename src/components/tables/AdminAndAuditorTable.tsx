import React, { useState, useEffect } from "react";
import {
  GridColDef,
  GridRenderCellParams,
  GridSortModel,
} from "@mui/x-data-grid";
import {
  Avatar,
  Box,
  Button,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { formatDate, getInitials } from "../../shared/helper";
import {
  useDeleteAdminDataRequest,
  useGetAdminAndAuditorDataRequest,
} from "../../services/steigenApisService";
import CustomPagination from "./pagination/CustomPagination";
import { AiFillEdit, RiDeleteBin6Line } from "../../assets/icons";
import { toast } from "react-toastify";
import DeleteAdminModal from "../modals/DeleteAdminModal";
import EditAdminForm from "../forms/EditAdminForm";
import AddAdminForm from "../forms/AddAdminForm";
import { IoSearch } from "react-icons/io5";
import { AxiosError } from "axios";
import { dataGridStyles } from "../../shared/constants";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../state/store";
import { erasePageData, storePageData } from "../../state/user/pageSlice";
import GoToTop from "../../shared/goToTop";
import AdminAuditorTableContent from "./AdminAuditorTableContent";
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

export interface Admin {
  id: number;
  fullName: string;
  role: string;
  position: string;
  emailId: string;
}

const AdminAndAuditorTable: React.FC = () => {
  const pageSize = 10;
  const [data, setData] = useState<User[]>([]);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [search, setSearch] = useState("");
  const [sequence, setSequence] = useState<{ field: any; order: any }>({
    field: "id",
    order: "asc",
  });
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const [selectedAdminData, setSelectedAdminData] = useState<Admin | null>(
    null
  );
  const dispatch = useDispatch();
  const { pageNumber } = useAppSelector((state) => state.storePageData);

  const {
    data: fetchedData,
    isLoading,
    isFetching,
    error,
  } = useGetAdminAndAuditorDataRequest(
    debouncedSearch,
    pageNumber,
    pageSize,
    sequence.field,
    sequence.order
  );
  const { mutate: deleteAdmin } = useDeleteAdminDataRequest();

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
        setSequence({ field: "", order: "" });
        setSortModel(newSortModel);
        localStorage.setItem(
          "sortTableBy",
          JSON.stringify({ field: "", order: "" })
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
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const handleCloseAddAdminForm = () => setOpenAdd(false);
  const handleOpenAdminForm = () => {
    setOpenAdd(true);
  };

  const handleCloseEditForm = () => {
    setSelectedAdminId(null);
    setSelectedAdminData(null);
    setOpenEdit(false);
  };

  const handleOpenEditForm = (id: number) => {
    const admin = fetchedData?.data.data.find(
      (admin: Admin) => admin.id === id
    );
    setSelectedAdminId(id);
    setSelectedAdminData(admin);
    setOpenEdit(true);
  };

  const handleOpenDeleteForm = (id: number) => {
    setSelectedAdminId(id);
    setOpen(true);
  };

  const handleCloseDeleteForm = () => {
    setSelectedAdminId(null);
    setOpen(false);
  };

  const handleDelete = () => {
    if (selectedAdminId !== null) {
      deleteAdmin(
        { adminId: selectedAdminId },
        {
          onSuccess: () => {
            setData(data.filter((admin) => admin.id !== selectedAdminId));
            setTotalCount((prevCount) => prevCount - 1);
            handleCloseDeleteForm();
            toast.success("Admin/Auditor deleted successfully");
          },
          onError: (err: AxiosError) => {
            if (err?.response?.status === 500) {
              toast.error("Server error");
            } else if (err?.response?.status === 404) {
              toast.error(
                "The admin/auditor you are trying to edit does not exist."
              );
            } else {
              console.log(err);
              toast.error("Error occurred while deleting admin/auditor");
            }
          },
        }
      );
    }
  };

  const cols: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Name",
      hideable: false,
      filterable: false,
      // disableColumnMenu:true,
      flex: 1,
      renderCell: (param: GridRenderCellParams) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Avatar
            alt={param.row.fullName}
            src={param.row.avatar}
            sx={{ bgcolor: "#fff8f0", color: "black" }}
          >
            {!param.row.avatar && getInitials(param.row.fullName)}
          </Avatar>{" "}
          &nbsp; &nbsp;
          {param.row.fullName}
        </div>
      ),
    },
    {
      field: "emailId",
      headerName: "Email",
      flex: 1,
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
    },
    {
      field: "createdAt",
      headerName: "Join Date",
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      flex: 0.5,
      renderCell: (param: GridRenderCellParams) =>
        formatDate(param.row.createdAt),
    },
    {
      field: "contact",
      headerName: "Verified Contact",
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      flex: 1,
      renderCell: (param: GridRenderCellParams) => (
        <>
          {param.row.verifiedContactId === "phoneNumber"
            ? param.row.phoneNumber
            : param.row.emailId}
        </>
      ),
    },
    {
      field: "role",
      headerName: "Role",
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      width: 120,
      renderCell: (param: GridRenderCellParams) => (
        <>
          {param.row.role.charAt(0).toLocaleUpperCase() +
            param.row.role.slice(1)}
        </>
      ),
    },
    {
      field: "position",
      headerName: "Position",
      width: 150,
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
    },
    {
      field: "actions",
      headerName: "Action",
      sortable: false,
      hideSortIcons: true,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        return (
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
    dispatch(
      storePageData({
        pageNumber: newPage,
      })
    );
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    dispatch(erasePageData());
  };

  return (
    <div style={{ width: "100%" }}>
      <DeleteAdminModal
        open={open}
        handleClose={handleCloseDeleteForm}
        handleDelete={handleDelete}
      />
      <EditAdminForm
        openEdit={openEdit}
        handleCloseEditForm={handleCloseEditForm}
        adminData={selectedAdminData as Admin}
      />
      <AddAdminForm open={openAdd} handleClose={handleCloseAddAdminForm} />

      <Box display={"flex"} justifyContent={"space-between"} my={2}>
        <Stack flexDirection={"row"} my={1}>
          <TextField
            placeholder="Search here"
            autoComplete="off"
            variant="outlined"
            size="small"
            value={search}
            sx={{
              background: "#f5f5f5",
              width: { xs: "100%", sm: "300px", md: "379px" },
            }}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IoSearch color="black" />
                </InputAdornment>
              ),
            }}
          />
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
            onClick={handleOpenAdminForm}
          >
            Add
          </Button>
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
        <AdminAuditorTableContent
          error={error}
          isLoading={isLoading}
          isFetching={isFetching}
          data={data}
          totalCount={totalCount}
          cols={cols}
          sortModel={sortModel}
          handleSortModelChange={handleSortModelChange}
          dataGridStyles={dataGridStyles}
        />
      </Stack>
      <GoToTop />
    </div>
  );
};

export default AdminAndAuditorTable;
