import { DataGrid, GridColDef, GridSortModel } from "@mui/x-data-grid";
import NoDataImage from "../cards/NoDataImage";
import UserTableSkeleton from "../skeleton/userTableSkeleton";
import ServerDownImage from "../cards/serverDown";

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

interface TableContentProps {
    error: any;
    isLoading: boolean;
    isFetching: boolean;
    data: User[]; 
    totalCount: number;
    cols: GridColDef[];
    sortModel: GridSortModel;
    handleSortModelChange: (model: GridSortModel) => void;
    dataGridStyles: object;
  }

const AdminAuditorTableContent: React.FC<TableContentProps> = ({
    error,
    isLoading,
    isFetching,
    data,
    totalCount,
    cols,
    sortModel,
    handleSortModelChange,
    dataGridStyles,
  }) => {

  if (isLoading || isFetching) {
    return <UserTableSkeleton />;
  }

  if (error?.message == "Network Error") {
    return <ServerDownImage />;
  }

  return data.length > 0 ? (
    <DataGrid
      rows={data}
      columns={cols}
      rowCount={totalCount}
      disableRowSelectionOnClick
      paginationMode="server"
      sortingMode="server"
      onSortModelChange={handleSortModelChange}
      sortModel={sortModel}
      sx={{ ...dataGridStyles, height: 'auto' }} 
      />
  ) : (
    <NoDataImage />
  );
};

export default AdminAuditorTableContent;

