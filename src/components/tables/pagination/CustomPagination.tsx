import { IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

interface CustomPaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

const styles = {
  iconButton: {
    backgroundColor: "#F5F5F5", // Background color for the circle
    borderRadius: "50%", // Make it a circle
    width: "30px", // Set a fixed width
    height: "30px", // Set a fixed height
  },
  iconButtonMargin: {
    marginLeft: "10px", // Space between the buttons
  },
};

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const [jumpToPage, setJumpToPage] = useState(currentPage.toString());

  useEffect(() => {
    setJumpToPage(currentPage.toString());
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty input to handle backspace properly
    if (/^\d*$/.test(value)) {
      // Update jumpToPage state
      setJumpToPage(value);

      const newPage = parseInt(value, 10);

      // Change page immediately if the input is a valid natural number
      if (newPage > 0 && newPage <= totalPages) {
        setJumpToPage(newPage.toString());

        onPageChange(newPage);
      } else if (newPage > totalPages) {
        setJumpToPage(totalPages.toString());
        onPageChange(totalPages);

      }
      else if( newPage === 0 ){
        setJumpToPage("1");
        onPageChange(1);
      }
    }
  };



  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="body2"
        fontWeight={600}
        sx={{ display: "flex", alignItems: "center", color: "#7A7A7A" }}
      >
        <span style={{ marginRight: "8px" }}>Page</span>
        <TextField
          size="small"
          id="outlined-basic"
          type="text" // Using text for better control
          inputMode="numeric" // Makes mobile keyboards numeric
          autoComplete="off"
          value={jumpToPage}
          onChange={handleInputChange}
          // onBlur={handleBlur} // Validate on blur
          inputProps={{
            style: {
              height: "17px",
            },
          }}
          sx={{
            maxWidth: "60px",
            alignItems: "center",
            width: `${Math.max(46, jumpToPage.length * 10)}px`, // dynamic width
            transition: "width 0.3s",
            height: "auto",
            "& input[type=text]": {
              MozAppearance: "textfield", // For Firefox
            },
          }}
        />
        <span style={{ marginLeft: "8px", marginRight: "4px" }}>of</span>
        {totalPages}
      </Typography>
      <div style={{ marginLeft: "7px" }}>
        <IconButton
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{ ...styles.iconButton, ...styles.iconButtonMargin }}
        >
          <GrFormPrevious />
        </IconButton>
        <IconButton
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{ ...styles.iconButton, ...styles.iconButtonMargin }}
        >
          <GrFormNext />
        </IconButton>
      </div>
    </div>
  );
};

export default CustomPagination;
