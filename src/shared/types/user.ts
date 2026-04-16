import { IconType } from "react-icons";

export type UserProfile = {
  id: string;
  name: string;
  profileImage: string;
  verifiedContact: "emailId" | "phoneNumber";
  emailId?: string;
  phoneNumber?: string;
  gender: "female" | "male" | "other";
  bloodType: string;
  account: {
    createdAt: string;
    language: "en" | "hn" | "mr";
    createdBy?: string;
    isBlocked: boolean;
    subscription: boolean;
  };
  healthRecords: {
    familyDoctorName?: string;
    doctorAddress?: string;
    disease?: string[];
    allergies?: string[];
  };
  personal: {
    country: string;
    dob: string;
    pincode: string;
    emergencyContact?: string;
    address?: string;
  };
  family?: {
    name: string;
    id: string;
    relation: string;
    profileImage?: string;
    linkType: "minor" | "subaccount" | "existing";
  }[];
  additionalInfo?: string;
};

export type FamilyType = {
  name: string;
  id: string;
  relation: string;
  profileImage?: string;
  linkType: "minor" | "subaccount" | "existing";
};

export type AdminData = {
  createdAt: string;
  emailId: string;
  fullName: string;
  id: number;
  position: string;
  role: "admin" | "auditor" | "superAdmin";
};

export type Icon ={
  RxDashboard: IconType;
  FiUsers: IconType;
  BiSolidDoughnutChart: IconType;
  MdOutlineSmartDisplay: IconType;
  MdOutlineAdminPanelSettings: IconType;
  VscFeedback: IconType;
  FiUserCheck: IconType;
}