//constants data here
export const Header = {
  feedback: "Complaints and Feedback",
  complaint: "Complaints and Feedback",
  dashboard: "Dashboard",
  users: "User List",
  reports: "Reports",
  contentmanagement: "Content Management",
  adminauditor: "Admin and Auditor",
};


export const NavItems = [
  {
    id: 1,
    header: "Dashboard",
    path: ["/dashboard"],
    navItemText: "Dashboard",
    icon: "RxDashboard",
    disabled: false,
  },
  {
    id: 2,
    header: "User List",
    path: ["/users"],
    navItemText: "Users",
    icon: "FiUsers",
    disabled: false,
  },
  {
    id: 3,
    header: "Reports",
    path: ["/reports"],
    navItemText: "Reports",
    icon: "BiSolidDoughnutChart",
    disabled: true,
  },
  {
    id: 4,
    header: "Content Management",
    path: ["/contentmanagement"],
    navItemText: "Content Management",
    icon: "MdOutlineSmartDisplay",
    disabled: false,
  },
  {
    id: 5,
    header: "Admin and Auditor",
    path: ["/adminauditor"],
    navItemText: "Admin and Auditor",
    icon: "MdOutlineAdminPanelSettings",
    disabled: false,
  },
  {
    id: 6,
    header: "Complaints and Feedback",
    path: ["/complaint", "/feedback"],
    navItemText: "Complaints/Feedback",
    icon: "VscFeedback",
    disabled: false,
  },
];

export const dataGridStyles = {
  "& .MuiDataGrid-cell.Mui-selected": {
    outline: "none", // Remove blue border or outline
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-footerContainer": {
    display: "none",
  },
  border: "none",
  "& .MuiDataGrid-cell": {
    borderBottom: "0.7px solid #EDEDED",
    borderTop: "none",
  },
  "& .MuiDataGrid-columnHeader": {
    borderBottom: "2px solid #D6D6D6",
    borderTop: "none",
  },
  "& .MuiDataGrid-row:hover .MuiTypography-root": {
    fontWeight: "medium",
    color: "black !important",

  },
  "& .MuiDataGrid-cell:focus": {
    outline: "none",
  },
  "& .MuiDataGrid-row:hover ": {
    backgroundColor: "#FBFBFB",
    color: "black ",
    fontWeight: "medium",

  },
  ".MuiDataGrid-iconButtonContainer": {
    visibility: "visible ",
  },
  ".MuiDataGrid-sortIcon": {
    opacity: "inherit !important",
  },
  "& .MuiDataGrid-menuIcon": {
    visibility: "visible  !important",
    width: " auto !important",
  },
  "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:focus":
    {
      outline: "none !important",
    },
  "& .MuiDataGrid-columnSeparator": {
    display: "none", // Hides the separators between column headers
  },
};
