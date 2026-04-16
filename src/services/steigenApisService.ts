/* eslint-disable react-hooks/rules-of-hooks */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient, { getToken } from "./api";
import { AxiosError } from "axios";

const checkSession = (body: { emailId: string }) => {
  const formData = {
    emailId: body.emailId,
  };
  return apiClient.post(`/check-session`, JSON.stringify(formData));
};

export function userCheckSession() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: checkSession,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err) => {
      return err;
    },
  });
  return mutation;
}

const logoutUser = () => {

  return apiClient.post(`/logout-admin`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export function userLogoutSession() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err) => {
      return err;
    },
  });
  return mutation;
}

const createUserOtp = (body: { emailId: string }) => {
  const formData = {
    emailId: body.emailId,
  };
  return apiClient.post(`/create-otp`, JSON.stringify(formData), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export function useUserCreateOtpRequest() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createUserOtp,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err) => {
      return err;
    },
  });
  return mutation;
}

const verifyUserOtp = (body: { emailId: string; otp: number }) => {
  const formData = {
    emailId: body.emailId,
    otp: body.otp,
  };
  return apiClient.post(`/verify-otp`, JSON.stringify(formData), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export function useVerifyCreateOtp() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: verifyUserOtp,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err) => {
      return err;
    },
  });
  return mutation;
}

// Edit self role and position (for admin and superadmin)
const patchEditAdminSelf = (body: { fullName: string; position: string }) => {
  return apiClient.patch("/update/admin_auditor", JSON.stringify(body), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

const patchEditSuperAdminSelf = (body: {
  fullName: string;
  position: string;
}) => {
  return apiClient.patch("/update-superAdmin", JSON.stringify(body), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export const usePatchEditAdminSelf = () => {
  const mutation = useMutation({
    mutationFn: patchEditAdminSelf,
    onSuccess: (res) => {
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
};

export const usePatchEditSuperadminSelf = () => {
  const mutation = useMutation({
    mutationFn: patchEditSuperAdminSelf,
    onSuccess: (res) => {
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
};

const getDashboardData = () => {
  return apiClient.get("/dashboard", {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export function useGetDashboardDataRequest() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardData(),
  });
}

const getAllUsersData = ({
  search,
  sortByField,
  sortByOrder,
}: {
  search: string;
  sortByField: string;
  sortByOrder: string;
}) => {
  return apiClient.get(`/users`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { search, sortByField, sortByOrder },
  });
};

export function useGetAllUsersDataRequest(
  search: string,
  sortByField: string,
  sortByOrder: string
) {
  return useQuery({
    queryKey: ["users", search, sortByField, sortByOrder],
    queryFn: () => getAllUsersData({ search, sortByField, sortByOrder }),
  });
}

const getUser = ({
  userId,
  type,
}: {
  userId: string | undefined;
  type: string | null;
}) => {
  return apiClient.get(`/getUserById/${userId}?type=${type}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export function useGetUserDataRequest(
  userId: string | undefined,
  type: string | null
) {
  return useQuery({
    queryKey: ["userId", userId, type],
    queryFn: () => getUser({ userId, type }),
  });
}

const blockUser = (body: { userId: string | undefined; reason: string }) => {
  const formData = {
    userId: body.userId,
    reason: body.reason,
  };
  return apiClient.post(`/admin-block-user`, JSON.stringify(formData), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export function useBlockUser() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: blockUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const unblockUser = async ({ userId }: { userId: string | undefined }) => {
  const response = await apiClient.post(`/unblock-user/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export function useUnblockUser() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: unblockUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err) => {
      return err;
    },
  });
  return mutation;
}

const deleteUser = async (body: {
  userId: string | undefined;
  reason: string;
}) => {
  const formData = {
    reason: body.reason,
  };
  const response = await apiClient.delete(`/users/${body.userId}`, {
    data: formData,
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err) => {
      return err;
    },
  });
  return mutation;
}

const getAdminAndAuditorData = (
  page: number,
  pageSize: number,
  search: string,
  sortByField: string,
  sortByOrder: string
) => {
  return apiClient.get(`/getAdminAuditor`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { page, limit: pageSize, search, sortByField, sortByOrder },
  });
};

export function useGetAdminAndAuditorDataRequest(
  search: string,
  page: number,
  pageSize: number,
  sortByField: string,
  sortByOrder: string
) {
  return useQuery({
    queryKey: ["getAdminAuditor", page, search, sortByField, sortByOrder],
    queryFn: () =>
      getAdminAndAuditorData(page, pageSize, search, sortByField, sortByOrder),
  });
}

const resendAdminOtp = (body: { emailId: string }) => {
  const formData = {
    emailId: body.emailId,
  };
  return apiClient.post(`/resend-otp/admin_auditor`, JSON.stringify(formData), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export function useUserResendOtpRequest() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: resendAdminOtp,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err) => {
      return err;
    },
  });
  return mutation;
}

const verifyAdminOtp = (body: { emailId: string; otp: number }) => {
  const formData = {
    emailId: body.emailId,
    otp: body.otp,
  };
  return apiClient.post(`/verify-otp/admin`, JSON.stringify(formData), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};
export function useAdminVerifyCreateOtp() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: verifyAdminOtp,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err) => {
      return err;
    },
  });
  return mutation;
}

const createAdminOtp = (body: {
  fullName: string;
  role: string;
  position: string;
  emailId: string;
}) => {
  const formData = {
    fullName: body.fullName,
    role: body.role,
    position: body.position,
    emailId: body.emailId,
  };
  return apiClient.post(`/sign-up/admin_auditor`, JSON.stringify(formData), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export function useAdminCreateOtpRequest() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createAdminOtp,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const editAdmin = async ({
  adminId,
  adminFormData,
}: {
  adminId: number;
  adminFormData: any;
}) => {
  const response = await apiClient.patch(
    `/update/admin_auditor/${adminId}`,
    JSON.stringify(adminFormData),
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.data;
};

export function useEditAdminDataRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editAdmin,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const deleteAdmin = async ({ adminId }: { adminId: number }) => {
  const response = await apiClient.delete(
    `/delete/adminAuditor?id=${adminId}`,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.data;
};

export function useDeleteAdminDataRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteAdmin,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const getAllVideoListData = ({
  page,
  limit,
  search,
  sortByField,
  sortByOrder,
}: {
  page: number;
  limit: number;
  search: string;
  sortByField: string;
  sortByOrder: string;
}) => {
  return apiClient.get(`/videos`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { page, limit, search, sortByField, sortByOrder },
  });
};

export function useGetAllVideoListDataRequest(
  page: number,
  limit: number,
  search: string,
  sortByField: string,
  sortByOrder: string
) {
  return useQuery({
    queryKey: ["videos", page, search, sortByField, sortByOrder],
    queryFn: () =>
      getAllVideoListData({ page, limit, search, sortByField, sortByOrder }),
  });
}


const addVideo = (body: {
  vidName: string,
  vidSourceUrl: string,
  vidTags: string[],
  isSubscribed: boolean,
  priority: string,
  isActive: boolean,

}) => {
  const formData = {
    vidName: body.vidName,
    vidSourceUrl: body.vidSourceUrl,
    vidTags: body.vidTags,
    isSubscribed: body.isSubscribed,
    priority: body.priority,
    isActive: body.isActive,
  }
  return apiClient.post(`/videos`, JSON.stringify(formData), {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export function useAddVideo() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addVideo,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const deleteVideo = async ({ videoId }: { videoId: number }) => {
  const response = await apiClient.delete(`/videos?id=${videoId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export function useDeleteVideotDataRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteVideo,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const editVideo = async ({
  videoId,
  videoValues,
}: {
  videoId: number;
  videoValues: any;
}) => {
  const response = await apiClient.patch(
    `/videos/${videoId}`,
    JSON.stringify(videoValues),
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
  return response.data;
};

export function useEditVideoDataRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editVideo,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const getAllAdvertiseListData = (
  page: number,
  limit: number,
  search: string
) => {
  return apiClient.get(`/advertisement`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { page, limit, search },
  });
};

export function useGetAllAdvertiseListDataRequest(
  page: number,
  limit: number,
  search: string
) {
  return useQuery({
    queryKey: ["advertisement", page, search],
    queryFn: () => getAllAdvertiseListData(page, limit, search),
  });
}

const addAdvertise = (advData: FormData) => {
  return apiClient.post(`/advertisement`, advData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export function useAddAdvertise() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addAdvertise,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const deleteAdvertise = async ({ advId }: { advId: number }) => {
  const response = await apiClient.delete(`/advertisement?id=${advId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export function useDeleteAdvertiseDataRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteAdvertise,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const editAdvertise = async ({
  advertiseId,
  advFormData,
}: {
  advertiseId: number;
  advFormData: FormData;
}) => {
  const response = await apiClient.put(
    `/advertisement/${advertiseId}`,
    advFormData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export function useEditAdvertiseDataRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editAdvertise,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const getAllFacilityListData = (
  page: number,
  limit: number,
  search: string
) => {
  return apiClient.get(`/facilities`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { page, limit, search },
  });
};

export function useGetAllFacilityListDataRequest(
  page: number,
  limit: number,
  search: string
) {
  return useQuery({
    queryKey: ["facilities", page, search],
    queryFn: () => getAllFacilityListData(page, limit, search),
  });
}


const addFacility = (facilityData: FormData) => {
  return apiClient.post(`/facilities`, facilityData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export function useAddFacility() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addFacility,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const deleteFacility = async ({ facId }: { facId: number }) => {
  const response = await apiClient.delete(`/facilities?id=${facId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  return response.data;
};

export function useDeleteFacilityDataRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteFacility,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const editFacility = async ({
  facilityId,
  updatedFacility,
}: {
  facilityId: number;
  updatedFacility: FormData;
}) => {
  const response = await apiClient.patch(
    `/facilities/${facilityId}`,
    updatedFacility,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getToken()}`
      }
    }
  );
  return response.data;
};


export function useEditFacilityDataRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: editFacility,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}

const getAggrigateCmsData = () => {
  return apiClient.get(`/all-content`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
};

export function useGetAggrigateCmsDataRequest() {
  return useQuery({
    queryKey: ["all-content"],
    queryFn: () => getAggrigateCmsData(),
  });
}

const getAllComplaintsAndFeedbackData = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  return apiClient.get(`/feedback-complaint`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    params: { page, limit },
  });
};

export function useGetAllFeedbackComplaintDataRequest(
  page: number,
  limit: number
) {
  return useQuery({
    queryKey: ["get-feedback-complaint", page],
    queryFn: () => getAllComplaintsAndFeedbackData({ page, limit }),
  });
}

const replyComplaint = (body: { complaintId: number; reply: string }) => {
  const formData = {
    reply: body.reply,
  };

  return apiClient.post(
    `/reply-complaint/${body.complaintId}`,
    JSON.stringify(formData),
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
};

export function useReplyComplaint() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: replyComplaint,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err) => {
      return err;
    },
  });
  return mutation;
}

const markComplaintFeedbackAsRead = ({
  id,
  type,
  isRead,
}: {
  id: number;
  type: string;
  isRead: boolean;
}) => {
  return apiClient.patch(
    `/get-userMessage/${id}`,
    { type, isRead },

    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );
};

export function getComplainById(id: number, type: string, isRead: boolean) {
  return useQuery({
    queryKey: ["feedback-complaint", id], // run only if id changes or on reconnect
    queryFn: () => markComplaintFeedbackAsRead({ id, type, isRead }),
  });
}


const refreshVideo = async () => {
  const response = await apiClient.put(
    `/videos/syncThumbnail`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  return response.data;
};

export function useRefreshVideoListDataRequest() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: refreshVideo,
    onSuccess: (res) => {
      queryClient.invalidateQueries();
      return res;
    },
    onError: (err: AxiosError) => {
      return err;
    },
  });
  return mutation;
}