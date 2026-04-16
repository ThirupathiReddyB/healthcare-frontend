import {
  Box,
  Button,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Modal,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { loginBgOrange, loginBgEllipse, loginPageImage } from "../../assets/images";

import OTPVerification from "./OtpVarification";

import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  userCheckSession,
  useUserCreateOtpRequest,
} from "../../services/steigenApisService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  emailId: string;
}

const SignIn = () => {
  const { mutate: createOtp, isPending } = useUserCreateOtpRequest();
  const { mutate: checkSession } = userCheckSession();
  const queryClient = useQueryClient();
  const [userMail, setUserMail] = useState<string>("");
  const [mailSent, setMailSent] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const theme = useTheme();
  const matchSmScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IFormInput>();
  const navigate = useNavigate();

  // Effects -----
  // Check if token already exists, and redirect user to signed in page
  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (Boolean(token)) 
      if(token) {
      navigate("/dashboard");
    }
  }, []);

  // Handlers ----
  const handleModalClose = () => setOpenModal(false);
  const handleContinue = () => {
    setOpenModal(false);
    triggerCreateOtp({ emailId: userMail });
  };

  const triggerCreateOtp = (data: IFormInput) => {
    createOtp(data, {
      onError: () => {
        queryClient.resetQueries();
        toast.error("Error occurred while sending OTP.");
      },
      onSuccess: () => {
        setMailSent(true);
        queryClient.resetQueries();
        toast.success("Please verify OTP");
      },
    });
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    setUserMail(data.emailId);

    checkSession(data, {
      onError: (err: any) => {
        if (err.response.status === 423) {
          setOpenModal(true);
        } else if (err.response.status === 404 && !toast.isActive("email-not-found")) {
          toast.error(
            "The entered email is not found. Please check and try again.",
            {
              toastId: "email-not-found", // Unique ID to avoid multiple toasts
              position: "top-center", // Customize position
              autoClose: 5000, // Optional: closes after 5 seconds
            }
          );
        } else if (!toast.isActive("custom-error")) {
          toast.error(err.response.data.error.message, {
            toastId: "custom-error",
            position: "top-center",
            autoClose: 5000,
          });
        }
      },
      onSuccess: (res) => {
        if (res.status === 200) {
          triggerCreateOtp(data);
        }
      },
    });
  };

  return (
    <Grid container height={"100vh"}>
      {!matchSmScreen && (
        <Grid item xs={6}>
          <Box
            sx={{
              width: "100%",
              height: "100%",
              background: `url(${loginBgOrange})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Typography
              sx={{
                position: "absolute",
                top: "8%",
                left: "6%",
                color: "white",
                fontSize: "52px",
                fontWeight: 600,
              }}
            >
              THITO
            </Typography>
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: {
                  xs: "30%",
                  md: "50%",
                },
                top: "50%",
                translate: "0px -30%",
                background: `url(${loginPageImage})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
                mb: 2,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                right: "-19%",
                top: { xs: "-5%", md: "-15%" },
                width: {
                  xs: "50%",
                  md: "40%",
                },
                height: {
                  xs: "50%",
                  md: "40%",
                },
                background: `url(${loginBgEllipse})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                left: "-5%",
                bottom: { xs: "-4%" },
                width: "145px",
                height: "145px",
                background: `url(${loginBgEllipse})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
            />
          </Box>
        </Grid>
      )}
      <Grid item xs={matchSmScreen ? 12 : 6}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!mailSent ? (
            <Box
              sx={{
                width: "60%",
                padding: "20px",
                borderRadius: "8px",
                textAlign: "center",
              }}
              component="form"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Typography fontWeight={600} fontSize={{ xs: 34, md: 44 }}>
                Welcome Back
              </Typography>
              <Controller
                name="emailId"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email is required",
                  minLength: {
                    value: 1,
                    message: "Email must be at least 1 character long",
                  },
                  maxLength: {
                    value: 280,
                    message: "Email must be at most 280 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    placeholder="Email"
                    variant="standard"
                    margin="normal"
                    error={!!errors.emailId}
                    helperText={errors.emailId ? errors.emailId.message : ""}
                    fullWidth
                    sx={{
                      "& .MuiInputBase-root": {
                        backgroundColor: "white",
                        borderRadius: "4px",
                      },
                      "& .MuiInput-underline:before": {
                        borderBottom: "2px solid orange",
                      },
                      "& .MuiInput-underline:after": {
                        borderBottom: "2px solid orange",
                      },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
                        borderBottom: "2px solid orange",
                      },
                    }}
                    InputProps={{
                      sx: {
                        "&.Mui-focused": {
                          backgroundColor: "white",
                        },
                      },
                    }}
                  />
                )}
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                disabled={isPending}
                sx={{
                  marginTop: "16px",
                  background:
                    "linear-gradient(90deg,rgba(255, 102, 0, 0.8), rgba(255, 102, 0, 0.5))",
                  borderRadius: "10px",
                  textTransform: "none",
                  fontSize: 16,
                }}
              >
                {isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
            </Box>
          ) : (
            <OTPVerification email={userMail} />
          )}
        </Box>
      </Grid>

      <Modal open={openModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Session Active
          </Typography>
          <Typography sx={{ mt: 2 }}>
            A session is already active with this email. Do you want to
            continue?
          </Typography>
          <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
            <Button
              variant="outlined"
              type="button"
              onClick={handleModalClose}
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
              onClick={handleContinue}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                background:
                  "linear-gradient(90deg,rgba(255, 102, 0, 0.9), rgba(255, 102, 0, 0.6))",
              }}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default SignIn;
