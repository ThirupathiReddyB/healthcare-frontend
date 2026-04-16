import React, { useEffect, useRef, useState } from "react";
import { styled, Theme, CSSObject } from "@mui/material/styles";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Modal,
  Stack,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { iconLogo } from "../../assets/images";
import { MdKeyboardArrowDown } from "react-icons/md";
import { getInitials, truncateCharacters } from "../../shared/helper";
import { Header, NavItems } from "../../shared/constants";
import { userLogoutSession } from "../../services/steigenApisService";
import { FiLogOut } from "react-icons/fi";
import { AiFillEdit, iconMap } from "../../assets/icons";
import { useAppSelector } from "../../state/store";
import { useDispatch } from "react-redux";
import { eraseUserData } from "../../state/user/userSlice";
import EditUserRoleForm from "../../components/forms/EditUserRoleForm";
import localStorage from "redux-persist/es/storage";
import { erasePageData } from "../../state/user/pageSlice";

const drawerWidth = 220;

const openedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: "#fff",
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#fff",
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  backgroundColor: "#fff",
  borderBottom: "1px solid gray",
  boxShadow: "none",
  padding: 0,
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));
export const AntTabs = styled(Tabs)({
  borderBottom: "1px solid #e8e8e8",
  "& .MuiTabs-indicator": {
    backgroundColor: "orange",
  },
});
interface StyledTabProps {
  label: string;
  value: string;
}

export const AntTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  [theme.breakpoints.up("sm")]: {
    minWidth: 0,
  },
  fontWeight: 600,
  fontSize: "1.20rem",
  marginRight: theme.spacing(1),
  color: "black",
  fontFamily: ["Urbanist"].join(","),
  "&:hover": {
    color: "#EF7612",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: "#EF7612",
    fontWeight: "900px",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#d1eaff",
  },
}));

const navbarCss = (paths: string | string[], isOpen: boolean) => {
  // Ensure paths is treated as an array
  const pathArray = Array.isArray(paths) ? paths : [paths];

  // Check if the current pathname matches any of the paths in the array
  const isActive = pathArray.some((path) => location.pathname.includes(path));

  if (isActive) {
    return {
      minHeight: 48,
      justifyContent: isOpen ? "initial" : "center",
      px: 2.5,
      color: "#EF7612",
      backgroundColor: "#fff8f0",
      borderRight: "3px solid orange",
    };
  }

  return {
    minHeight: 48,
    justifyContent: isOpen ? "initial" : "center",
    px: 2.5,
    color: "#7A7A7A",
    backgroundColor: "#ffffff",
    borderRight: "none",
  };
};

const TextCss = (paths: string | string[], isOpen: boolean) => {
  // Ensure paths is treated as an array
  const pathArray = Array.isArray(paths) ? paths : [paths];

  // Check if the current pathname matches any of the paths in the array
  const isActive = pathArray.some((path) => location.pathname.includes(path));

  if (isActive) {
    return {
      opacity: isOpen ? 1 : 0,
      fontWeight: 600,
    };
  }
  return {
    opacity: isOpen ? 1 : 0,
    fontWeight: 400,
  };
};

const IconCss = (paths: string | string[], isOpen: boolean) => {
  // Ensure paths is treated as an array
  const pathArray = Array.isArray(paths) ? paths : [paths];

  // Check if the current pathname matches any of the paths in the array
  const isActive = pathArray.some((path) => location.pathname.includes(path));

  if (isActive) {
    return {
      minWidth: 0,
      mr: isOpen ? 2 : "auto",
      justifyContent: "center",
      color: "#EF7612",
    };
  }

  return {
    minWidth: 0,
    mr: isOpen ? 2 : "auto",
    justifyContent: "center",
    color: "#7A7A7A",
  };
};

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const prevLocationRef = useRef<string | null>(null);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [open, setOpen] = React.useState(true);
  const [isOpenProfile, setIsOpenProfile] = React.useState(false);
  const [header, setHeader] = React.useState(
    Header[location.pathname.split("/")[1] as keyof typeof Header]
  );
  const [openEditRole, setOpenEditRole] = useState(false);
  const dispatch = useDispatch();
 
  const { fullName, email, role } = useAppSelector(
    (state) => state.storeUserData
  );

  useEffect(() => {
    const prevLocation = prevLocationRef.current;

    // On the first load, set the flag to false and return early
    if (isFirstLoad) {
      setIsFirstLoad(false);
      // Update prevLocation to current location
      prevLocationRef.current = location.pathname;
      return;
    }
    const isSameBasePath =
      prevLocation &&
      location.pathname.startsWith(`/${prevLocation.split("/")[1]}`);
    // If not the first load and the previous location is different, execute your logic
    if (
      prevLocation !== null &&
      prevLocation !== location.pathname &&
      !isSameBasePath
    ) {
      localStorage.removeItem("sortTableBy");
      dispatch(erasePageData());
    }

    // Update the previous location to the current one
    prevLocationRef.current = location.pathname;
  }, [location, dispatch, isFirstLoad]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(true);
  };

  function handleOpen() {
    setIsOpenProfile(true);
  }

  function handleClose() {
    setIsOpenProfile(false);
  }
  const mutation = userLogoutSession();

  function logoutHandler() {
    mutation.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("token");
        dispatch(eraseUserData());

        navigate("/", { replace: true });
      },
    });
  }

  const handleEditFormOpen = () => {
    setOpenEditRole(true);
  };

  const handleEditFormClose = () => {
    setOpenEditRole(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open} sx={{ border: "none" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Stack flexDirection={"row"}>
            {/* logo */}
            <Box height={"60px"} width={"221px"}>
              <img src={iconLogo} alt="logo" width="100%" height="100%" />
            </Box>

            <Box ml={3} textAlign={"center"}>
              <Typography
                sx={{
                  pr: 4,
                  fontSize: 26,
                  fontWeight: 600,
                  color: "black",
                  mt: "10px",
                }}
              >
                {header}
              </Typography>
            </Box>
          </Stack>
          <Box display={"flex"} justifyContent={"space-between"} pt={1}>
            <Avatar
              alt="user"
              src={fullName}
              sx={{ mr: 2, cursor: "pointer", fontSize: "16px" }}
              //   onClick={handleOpen}
            >
              {getInitials(fullName)}
            </Avatar>
            <Stack flexDirection={"column"}>
              <Box display={"flex"}>
                <Typography color={"black"} fontWeight={600}>
                  {fullName}
                </Typography>
              </Box>

              <Typography color={"gray"} fontWeight={500}>
                {role === "superAdmin"
                  ? "Super admin"
                  : role.charAt(0).toLocaleUpperCase() + role.slice(1)}
              </Typography>
            </Stack>
            <IconButton onClick={handleOpen} sx={{ height: "25px" }}>
              <MdKeyboardArrowDown color="black" size={25} />
            </IconButton>
          </Box>
        </Box>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        onMouseEnter={handleDrawerOpen}
        onMouseLeave={handleDrawerClose}
      >
        <DrawerHeader />
        <List>
          {NavItems.map((item) => {
            const icon = item.icon as keyof typeof iconMap;
            const IconComponent = iconMap[icon];

            return (
              <ListItem disablePadding key={item.id}>
                <ListItemButton
                  onClick={() => setHeader(item.header)}
                  component={Link}
                  onDragStart={(e) => e.preventDefault()} // Prevent drag behavior
                  to={item.path[0]}
                  sx={navbarCss(item.path, open)}
                  disabled={item.disabled}
                >
                  <ListItemIcon
                    onClick={() => setHeader(item.header)}
                    sx={IconCss(item.path, open)}
                  >
                    {IconComponent && <IconComponent size={18} />}
                  </ListItemIcon>
                  <Typography sx={TextCss(item.path, open)}>
                    {item.navItemText}
                  </Typography>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflowX: "hidden" }}>
        <DrawerHeader />
        <Outlet />
      </Box>
      {isOpenProfile ? (
        <Modal open={isOpenProfile} onClose={handleClose}>
          <Box
            py={4}
            sx={{
              width: 350,
              backgroundColor: "#fff",
              color: "#00000",
              position: "absolute",
              top: 60,
              right: 5,
              borderRadius: "20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: 4,
              }}
              mb={1}
            >
              <Stack flexDirection={"column"}>
                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  alignItems={"center"}
                >
                  <Avatar
                    alt="user"
                    src={fullName}
                    sx={{
                      backgroundColor: "#FFB374",
                      width: 65,
                      height: 65,
                      color: "black",
                      fontWeight: 600,
                    }}
                    //   onClick={handleOpen}
                  >
                    {getInitials(fullName)}
                  </Avatar>{" "}
                  <Typography
                    fontSize={20}
                    fontWeight={600}
                    sx={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 200, // Adjust max width as needed
                    }}
                  >
                    {truncateCharacters(fullName, 17)}
                  </Typography>
                  <Stack direction={"row"} alignItems={"center"} gap={1}>
                    <Typography fontSize={14}>{email}</Typography>
                    {(role === "superAdmin" || role === "admin") && (
                      <IconButton disableRipple onClick={handleEditFormOpen}>
                        <AiFillEdit
                          color="#EF7612"
                          style={{ cursor: "pointer" }}
                          size={16}
                        />
                      </IconButton>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Divider
              sx={{ marginBottom: 1, backgroundColor: "#FFB374", mt: 5 }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                // alignItems: "center",
                cursor: "pointer",
                paddingY: 1,
                paddingX: 4,
              }}
              onClick={logoutHandler}
            >
              <FiLogOut size={22} />
              <Typography fontWeight={500} pl={2}>
                Sign Out
              </Typography>
            </Box>
          </Box>
        </Modal>
      ) : null}
      {
        <EditUserRoleForm
          openEdit={openEditRole}
          handleCloseEditForm={handleEditFormClose}
        />
      }
    </Box>
  );
}
