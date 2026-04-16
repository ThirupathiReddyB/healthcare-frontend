export type FeedBackComplaint = {
  id: number;
  message: string;
  messageType: "feedback" | "complaint";
  emailId: string;
  reply?: string;
  replyBy?: string;
  createdAt: string;
  updatedAt: string;
  isReplied: boolean;
  complaintId:BigInt;
  isRead:boolean,
  user: {
    id: string;
    fullName: string;
    profileImage:string
  };
};
