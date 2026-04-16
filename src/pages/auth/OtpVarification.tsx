import React, { useState, useEffect } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import OtpInput from "../../components/otpInput/OtpInput";
import { useNavigate } from "react-router-dom";
import {
  useUserCreateOtpRequest,
  useVerifyCreateOtp,
} from "../../services/steigenApisService";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { storeUserData } from "../../state/user/userSlice";

interface OTPVerificationPageProps {
  email: string;
}

const OTPVerification: React.FC<OTPVerificationPageProps> = ({ email }) => {
  const { mutate, isPending } = useVerifyCreateOtp();
  const { mutate: createOtpMutate } = useUserCreateOtpRequest();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [otp, setOtp] = useState<number>(0);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState<number>(30);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);


  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;
        setIsResendDisabled(false); // Enable resend button when timer finishes
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOTPChange = (otp: string) => {
    setOtp(Number(otp));
  };

  const handleResendCode = () => {
    setIsResendDisabled(true); // Disable the resend button
    setTimer(30); // Reset the timer

    createOtpMutate(
      { emailId: email },
      {
        onSuccess: () => {
          toast.success("OTP has been resent to your email.");
        },
        onError: () => {
          toast.error("Failed to resend OTP.");
          setIsResendDisabled(false); // Re-enable the resend button if the request fails
        },
      }
    );
  };

  const onSubmit = () => {
    const data = {
      emailId: email,
      otp: otp,
    };
    mutate(data, {
      onError: (err) => {
        toast.error("Invalid OTP...Login failed!");
        console.log(err);
        queryClient.resetQueries();
      },
      onSuccess: (res) => {
        queryClient.resetQueries();
        localStorage.setItem("token", res.data.data.accessToken);

        // Save user data in redux store
        dispatch(
          storeUserData({
            fullName: res.data.data.name,
            role: res.data.data.role,
            email: res.data.data.emailId,
            position: res.data.data.position,
          })
        );
        navigate("/dashboard", { replace: true });
        toast.success("Logged in successfully");
      },
    });
  };

  const formatTimer = (time: number) => {
    const formattedTime = time < 10 ? `0${time}` : time.toString();
    return `00:${formattedTime}`;
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Typography
        fontSize={{ xs: 32, lg: 44 }}
        fontWeight={600}
        gutterBottom
        textAlign={"center"}
      >
        We emailed you an OTP
      </Typography>

      <Typography fontSize={{ xs: 18, lg: 24 }} sx={{ mb: 1 }}>
        Enter the verification OTP sent to:{" "}
        <Typography
          fontSize={{ xs: 18, lg: 24 }}
          fontWeight={600}
          sx={{ bgcolor: "#fff8f0" }}
        >
          {email}
        </Typography>
      </Typography>
      <OtpInput 
  length={4} 
  onChange={handleOTPChange} 
  onKeyPress={(e) => {
    if (e.key === "Enter") {
      onSubmit(); // Call your submit function
    }
  }} 
/>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          width: "70%",
          maxWidth: "320px",
        }}
      >
        <Typography variant="body2" color="orange">
          {formatTimer(timer)}

        </Typography>
        <Typography
          variant="body2"
          color={isResendDisabled ? "gray" : "orange"}
          sx={{ cursor: isResendDisabled ? "default" : "pointer", pl: 1 }}
          onClick={!isResendDisabled ? handleResendCode : undefined}
        >
          Resend code
        </Typography>
      </Box>
      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        disabled={isPending}
        sx={{
          marginTop: "36px",
          background:
            "linear-gradient(90deg,rgba(255, 102, 0, 0.9), rgba(255, 102, 0, 0.6))",
          textTransform: "none",
          fontSize: 16,
        }}
        onClick={onSubmit}
      >
        {isPending ? <CircularProgress size={24} color="inherit" /> : "Login"}
      </Button>
    </Box>
  );
};

export default OTPVerification;
