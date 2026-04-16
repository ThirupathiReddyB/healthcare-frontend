import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Modal } from "@mui/material";
import OtpInput from "../../components/otpInput/OtpInput";
import {
  useAdminVerifyCreateOtp,
  useUserResendOtpRequest,
} from "../../services/steigenApisService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Modalstyle } from "../../theme/styles";

interface AdminOTPVerificationPageProps {
  email: string;
  open: boolean;
  handleClose: () => void;
}

interface IFormInput {
  emailId: string;
}
const AdminOtpVerification: React.FC<AdminOTPVerificationPageProps> = ({
  email,
  open,
  handleClose,
}) => {
  const { mutate, isPending } = useAdminVerifyCreateOtp();
  const queryClient = useQueryClient();
  const [otp, setOtp] = useState<number>(0);
  const [timer, setTimer] = useState<number>(30);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);

  const { mutate: createResendAdminOtp } = useUserResendOtpRequest();

  useEffect(() => {
    if (open) {
      setTimer(30); // Reset timer to initial value when modal opens
      setIsResendDisabled(true); // Disable resend button initially

      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev === 1) {
            setIsResendDisabled(false); // Enable resend button when timer reaches 0
          }
          return prev > 0 ? prev - 1 : 0;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [open]);

  const handleOTPChange = (otp: string) => {
    setOtp(Number(otp));
  };

  const formatTimer = (time: number) => {
    const formattedTime = time < 10 ? `0${time}` : time.toString();
    return `00:${formattedTime}`;
  };
  

  const handleResendCode = () => {
    const data: IFormInput = { emailId: email };
    createResendAdminOtp(data, {
      onError: () => {
        queryClient.resetQueries();
        toast.error("Error occurred while sending OTP.");
      },
      onSuccess: () => {
        queryClient.resetQueries();
        toast.success("OTP sent again on the email");
        setTimer(30); // Reset the timer after resending the OTP
        setIsResendDisabled(true);
      },
    });
  };

  const onSubmit = () => {
    const data = {
      emailId: email,
      otp: otp,
    };
    mutate(data, {
      onError: () => {
        queryClient.resetQueries();
        toast.error("OTP verification failed");
      },
      onSuccess: () => {
        queryClient.resetQueries();
        handleClose();
        toast.success("OTP verified successfully");
      },
    });
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={{ ...Modalstyle, width: "400" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography fontSize={24} fontWeight={600} gutterBottom>
            OTP verification
          </Typography>
          <Box display={"flex"} alignItems={"center"} mb={3}>
            <Typography fontSize={16} sx={{ mb: 1, textAlign: "center" }}>
              Enter the verification OTP sent to:
              <Typography fontSize={16} fontWeight={600}>
                {email}
              </Typography>
            </Typography>
          </Box>

          <OtpInput length={4} onChange={handleOTPChange}  onKeyPress={(e) => {
    if (e.key === "Enter") {
      onSubmit(); // Call your submit function
    }
  }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "50%",
              maxWidth: "300px",
            }}
          >
            <Typography variant="body2" color="orange">
              {formatTimer(timer)}
            </Typography>
            <Typography
              variant="body2"
              color={isResendDisabled ? "gray" : "orange"}
              sx={{ cursor: isResendDisabled ? "default" : "pointer" }}
              onClick={isResendDisabled ? undefined : handleResendCode}
            >
              Resend code
            </Typography>
          </Box>

          <Box display="flex" justifyContent={"center"} gap="16px" my={4}>
            <Button
              variant="outlined"
              type="button"
              onClick={handleClose}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                color: "gray",
                borderColor: "gray",
                "&:hover": {
                  backgroundColor: "white",
                  color: "orange",
                  borderColor: "orange",
                },
              }}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              type="submit"
              onClick={onSubmit}
              disabled={isPending}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                background:
                  "linear-gradient(90deg,rgba(255, 102, 0, 0.9), rgba(255, 102, 0, 0.6))",
              }}
            >
              Verify
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AdminOtpVerification;
