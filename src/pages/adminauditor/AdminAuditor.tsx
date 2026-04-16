import NoAccessRights from "../../components/cards/NoAccessRights";
import AdminAndAuditorTable from "../../components/tables/AdminAndAuditorTable";
import { useAppSelector } from "../../state/store";

const AdminAuditor = () => {
  const { role } = useAppSelector((state) => state.storeUserData);
  return (
    <div
      style={{
        alignContent: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      {role != "superAdmin" ? <NoAccessRights /> : <AdminAndAuditorTable />}
    </div>
  );
};

export default AdminAuditor;
