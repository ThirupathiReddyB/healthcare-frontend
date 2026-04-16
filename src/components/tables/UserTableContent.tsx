import React from "react";
import { DataGrid, GridSortModel } from "@mui/x-data-grid";
import { dataGridStyles } from "../../shared/constants";
import NoDataImage from "../cards/NoDataImage";
import ServerDownImage from "../cards/serverDown";
import UserTableSkeleton from "../skeleton/userTableSkeleton";

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

interface UsersTableContentProps {
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  data: User[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  cols: any[];
  handleSortModelChange: (newSortModel: GridSortModel) => void;
  sortModel: GridSortModel;
  handleRowClick: any;
}

const UsersTableContent: React.FC<UsersTableContentProps> = ({
  error,
  isLoading,
  isFetching,
  data,
  pageNumber,
  pageSize,
  totalCount,
  cols,
  handleSortModelChange,
  sortModel,
  handleRowClick,
}) => {
  if (error?.message === "Network Error") {
    return <ServerDownImage />;
  }
  if (isLoading || isFetching) {
    return <UserTableSkeleton />;
  }
  if (data.length === 0) {
    return <NoDataImage />;
  }
  return (
    <DataGrid
      rows={data.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)}
      columns={cols}
      rowCount={totalCount}
      disableRowSelectionOnClick
      paginationMode="server"
      sortingMode="server"
      onSortModelChange={handleSortModelChange}
      sortModel={sortModel}
      sx={{
        ...dataGridStyles,
        "& .MuiDataGrid-row:hover": {
          cursor: "pointer",
        },
        height: "auto",
      }}
      onRowClick={handleRowClick}
    />
  );
};

export default UsersTableContent;
