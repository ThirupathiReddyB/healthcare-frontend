export type Advertisement = {
  serialNumber: number;
  id: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  advName: string;
  advRedirectLink: string;
  advSourceUrl: string;
  isSubscribed: string;
  priority: string;
  updatedBy: string;
  advPosition: "top" | "bottom";
  advType: "feature" | "promotion";
};

export type Facility = {
  id: number;
  createdAt: string;
  updatedAt: string;
  facPhoneNumber: string;
  facAddress: string;
  facPincode: string;
  facSpeciality: string[];
  facType: string;
  isActive: boolean;
  facPrimaryName: string;
  facSecondaryName: string;
  updatedBy: string;
  facImageURL: string;
};

export type FaciltyFormAdd = {
  facPrimaryName: string;
  facSecondaryName: string;
  facPhoneNumber: string;
  facAddress: string;
  facPincode: string;
  facSpeciality: string[]; // Assuming it's an array of strings; adjust if necessary
  facType: string;
  facImageFile: File | null;
  initialImage: string | null;
};

export type FaciltyFormEdit = {
  facPrimaryName?: string;
  facSecondaryName?: string;
  facPhoneNumber?: string;
  facAddress?: string;
  facPincode?: string;
  facSpeciality?: string[]; // Assuming it's an array of strings; adjust if necessary
  facType?: string;
};

export type VideoData = {
  id: number;
  vidName: string;
  vidSourceUrl: string;
  vidTags: string[];
  isSubscribed: string | boolean;
  priority: number;
  isActive: boolean;
  imageFile?: string;
};
