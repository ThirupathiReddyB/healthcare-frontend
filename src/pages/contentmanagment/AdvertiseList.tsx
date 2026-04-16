import React, { useEffect, useState } from "react";
import { useGetAllAdvertiseListDataRequest } from "../../services/steigenApisService";
import AdvertiseCard from "../../components/cards/AdvertiseCard";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
} from "@mui/material";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../components/tables/pagination/CustomPagination";
import AddAdvertiseForm from "../../components/forms/AddAdvertiseForm";
import NoContentCard from "../../components/cards/NoContentCard";
import { Advertisement } from "../../shared/types/contentManagement";
import { useAppSelector } from "../../state/store";
import { IoSearch } from "react-icons/io5";

const AdvertiseList = () => {
  const { role } = useAppSelector((state) => state.storeUserData);

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [openAdvForm, setOpenAdvForm] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [data, setData] = useState<[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const { data: fetchedAdvData } = useGetAllAdvertiseListDataRequest(
    currentPage,
    itemsPerPage,
    debouncedSearch
  );
  useEffect(() => {
    if (fetchedAdvData) {
      setTotalCount(fetchedAdvData?.data.data.totalRecords);
      setData(fetchedAdvData?.data.data.data);
    }
  }, [fetchedAdvData, currentPage]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 900);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  const handleCloseAddAdvForm = () => setOpenAdvForm(false);
  const handleOpenAdvertiseForm = () => {
    setOpenAdvForm(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <Box>
      {openAdvForm && (
        <AddAdvertiseForm
          open={openAdvForm}
          handleClose={handleCloseAddAdvForm}
        />
      )}
      <Stack flexDirection={"row"} my={1}>
        <Box display={"flex"} alignItems={"center"}>
          <IconButton onClick={() => navigate("/contentmanagement")}>
            <BiArrowBack color="black" size={20} />
          </IconButton>
          <Typography sx={{ pl: 2, fontSize: 22, fontWeight: 600 }}>
            Advertise list
          </Typography>
        </Box>
      </Stack>
      <Box display={"flex"} sx={{ alignItems: "center" }} mt={3}>
        <TextField
          sx={{
            background: "#f5f5f5",
            width: { xs: "100%", sm: "300px", md: "379px" },
          }}
          placeholder="Search here"
          autoComplete="off"
          variant="outlined"
          size="small"
          value={searchTerm}
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
            onClick={handleOpenAdvertiseForm}
          >
            Add
          </Button>
        )}
        <Box sx={{ ml: "auto" }}>
          <CustomPagination
            currentPage={currentPage}
            pageSize={itemsPerPage}
            onPageChange={handlePageChange}
            totalCount={totalCount}
          />
        </Box>
      </Box>
      <Grid container spacing={2} mt={2}>
        {data && data.length > 0 ? (
          data?.map((item: Advertisement) => (
            <AdvertiseCard
              key={item.id}
              id={item.id}
              title={item.advName}
              link={item.advSourceUrl}
              redirectLink={item.advRedirectLink}
              priority={item.priority}
              position={item.advPosition}
              status={item.isActive}
              subscriptionType={item.isSubscribed}
            />
          ))
        ) : (
          <NoContentCard contentType="Advertisements" />
        )}
      </Grid>
    </Box>
  );
};

export default AdvertiseList;
