import { RxDashboard } from "react-icons/rx";
import { FiUsers, FiUserX , FiUserCheck} from "react-icons/fi";
import { BiSolidDoughnutChart } from "react-icons/bi";
import { MdOutlineSmartDisplay, MdOutlineAdminPanelSettings } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { GrFormPrevious , GrFormNext } from "react-icons/gr";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IconType } from "react-icons";


//used for navbar icons
export const iconMap: {
  RxDashboard: IconType | string;
  FiUsers: IconType | string;
  BiSolidDoughnutChart: IconType | string;
  MdOutlineSmartDisplay: IconType | string;
  MdOutlineAdminPanelSettings: IconType | string;
  VscFeedback: IconType | string;
  FiUserCheck: IconType | string;
  FiUserX: IconType | string; // Add FiUserX here
} = {
  RxDashboard,
  FiUsers,
  BiSolidDoughnutChart,
  MdOutlineSmartDisplay,
  MdOutlineAdminPanelSettings,
  VscFeedback,
  FiUserCheck,
  FiUserX, // Include FiUserX in the object
};


export {
  RxDashboard,
  FiUsers,
  BiSolidDoughnutChart,
  MdOutlineSmartDisplay,
  MdOutlineAdminPanelSettings,
  VscFeedback,
  FiUserCheck,
  GrFormPrevious,
  GrFormNext,
  AiFillEdit,
  RiDeleteBin6Line,
  FiUserX,
};
