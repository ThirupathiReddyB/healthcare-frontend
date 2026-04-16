import React, { useEffect, useState } from "react";
import { useGetAllFacilityListDataRequest } from "../../services/steigenApisService";
import {
  Grid,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Stack,
  InputAdornment,
} from "@mui/material";
import FacilityCard from "../../components/cards/FacilityCard";
import { BiArrowBack } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../components/tables/pagination/CustomPagination";
import { Facility } from "../../shared/types/contentManagement";
import { useAppSelector } from "../../state/store";
import { IoSearch } from "react-icons/io5";
import NewAddFacilityForm from "../../components/forms/NewAddFacilityForm";

const Facilities = () => {
  const navigate = useNavigate();
  const { role } = useAppSelector((state) => state.storeUserData);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);
  const [data, setData] = useState<[]>([]);
  const itemsPerPage = 9;
  const { data: fetchedFacData } = useGetAllFacilityListDataRequest(
    currentPage,
    itemsPerPage,
    debouncedSearch
  );

  useEffect(() => {
    if (fetchedFacData) {
      setTotalCount(fetchedFacData?.data.data.totalRecords);
      setData(fetchedFacData?.data.data.data);
    }
  }, [fetchedFacData, currentPage]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 900);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    if (newPage > currentPage && newPage === totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
    setCurrentPage(newPage);
  };

  const [openFacForm, setOpenFacForm] = useState(false);

  const handleCloseAddFacForm = () => setOpenFacForm(false);
  const handleOpenFacilityForm = () => {
    setOpenFacForm(true);
  };

  return (
    <Box>
      <NewAddFacilityForm
        open={openFacForm}
        handleCloseAddFacForm={handleCloseAddFacForm}
      />

      <Stack flexDirection={"row"} my={1}>
        <Box display={"flex"} alignItems={"center"}>
          <IconButton onClick={() => navigate("/contentmanagement")}>
            <BiArrowBack color="black" size={20} />
          </IconButton>
          <Typography sx={{ pl: 2, fontSize: 22, fontWeight: 600 }}>
            Facilities list
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
          variant="outlined"
          autoComplete="off"
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
            onClick={handleOpenFacilityForm}
          >
            Add
          </Button>
        )}
        <Box sx={{ ml: "auto" }}>
          <CustomPagination
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </Box>
      </Box>
      <Grid container spacing={2} mt={2}>
        {data && data.length > 0 ? (
          data.map((item: Facility) => (
            <FacilityCard
              key={item.id}
              id={item.id}
              primaryName={item.facPrimaryName}
              secondaryName={item.facSecondaryName}
              phoneNumber={item.facPhoneNumber}
              address={item.facAddress}
              speciality={item.facSpeciality}
              facilityType={item.facType}
              pinCode={item.facPincode}
              status={item.isActive}
              imageURL={item.facImageURL}
            />
          ))
        ) : (
          <Box sx={{ width: "100%", textAlign: "center", mt: 2 }}>
            <Typography fontSize={22} fontWeight={500}>
              No results found
            </Typography>
          </Box>
        )}
      </Grid>
    </Box>
  );
};

export default Facilities;
