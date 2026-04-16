import {
  Box,
  Modal,
  Typography,
  Paper,
  Grid,
  FormControl,
  TextField,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import { RiCloseLargeLine } from "react-icons/ri";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { useAdminCreateOtpRequest } from "../../services/steigenApisService";
import AdminOtpVerification from "../../pages/adminauditor/AdminOtpVerification";
import { useState } from "react";
import { Modalstyle } from "../../theme/styles";
import SaveCancelGroupBtn from "../button/SaveCancelGroupBtn";
import { AxiosError } from "axios";

type addModalProps = {
  open: boolean;
  handleClose: () => void;
};

const AddAdminForm = ({ open, handleClose }: addModalProps) => {
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [email, setEmail] = useState<string>("");
  const { mutate, isPending } = useAdminCreateOtpRequest();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      role: "",
      position: "",
      emailId: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().trim().required("Full Name is required").min(2, "Name must be atleast 2 characters").max(50,"Maximum 50 characters allowed.").matches(/^[A-Za-z ]+$/, "Special characters are not allowed"),
      role: Yup.string().required("Role is required"),
      position: Yup.string().trim().required("Position is required").min(2, "Position must be atleast 2 characters").max(30,"Maximum 30 characters allowed.").matches(/^[A-Za-z ]+$/, "Special characters are not allowed"),
      emailId: Yup.string().trim().min(1, "Email must be atleast 1 character").max(280,"Maximum 280 characters allowed.")
        .required("Email Id is required")
        .email("Invalid email format"),
    }),
    onSubmit: (values) => {

      const addAdmin = {
        ...values,
      };

      mutate(addAdmin, {
        onSuccess: () => {
          toast.success("Please verify otp to add Admin");
          setEmail(values.emailId);
          setOtpModalOpen(true);
          handleClose();
          formik.resetForm();
        },
        onError: (err: AxiosError) => {
          if (err?.response?.status === 500) {
            toast.error("Server error");
          } else if (err?.response?.status === 422) {
            toast.error(
              "It looks like admin/auditor with entered email id already exist."
            );
          } else {
            console.log(err);
            toast.error("Error occurred while adding admin/auditor");
          }
        },
      });
    },
  });

  const handleFormClose = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Box>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={Modalstyle}>
          <Box sx={{ maxHeight: "80vh", overflow: "auto" }}>
          <Box display={"flex"} justifyContent={"space-between"} mt={2}>
            <Typography
              id="modal-modal-title"
              fontWeight={600}
              fontSize={"24px"}
            >
              Add Admin / Auditor
              </Typography>
            <RiCloseLargeLine
              style={{ cursor: "pointer", paddingTop: "10px" }}
              onClick={handleFormClose}
            />
          </Box>
           
          
            <form onSubmit={formik.handleSubmit}>
              <Paper
                sx={{ mt: 4, borderRadius: "10px" }}
                elevation={0}
                variant="outlined"
              >
                <Grid container spacing={4} p={3}>
                  <Grid
                    item
                    md={6}
                    display="flex"
                    flexDirection="column"
                    flex={1}
                    rowGap={2}
                  >
                    <FormControl>
                      <Typography variant="caption" fontSize={14} mb={1}>
                        Name
                      </Typography>
                      <TextField
                        id="fullName"
                        name="fullName"
                        placeholder="Name"
                        autoComplete="off"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.fullName &&
                          Boolean(formik.errors.fullName)
                        }
                       
                      />
                      <FormHelperText sx={{ height: "7px", color: "red" }}>
                        {formik.touched.fullName && formik.errors.fullName}
                      </FormHelperText>
                    </FormControl>
                    <FormControl>
                      <Typography variant="caption" fontSize={14} mb={1}>
                        Role
                      </Typography>
                      <Select
                        id="role"
                        name="role"
                        value={formik.values.role}
                        onChange={(e) =>
                          formik.setFieldValue("role", e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        placeholder="Role Type"
                        error={
                          formik.touched.role && Boolean(formik.errors.role)
                        }
                        renderValue={(selected: string) => {
                          if (!selected) {
                            return (
                              <span style={{ color: "grey" }}>Role Type</span>
                            );
                          }
                          return (
                            selected.charAt(0).toUpperCase() + selected.slice(1)
                          );
                        }}
                      >
                        <MenuItem value={"auditor"}>Auditor</MenuItem>
                        <MenuItem value={"admin"}>Admin</MenuItem>
                      </Select>
                   
                        <FormHelperText sx={{ height: "7px", color: "red" }}>
                        {formik.touched.role && formik.errors.role}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid
                    item
                    md={6}
                    display="flex"
                    flexDirection="column"
                    flex={1}
                    rowGap={2}
                  >
                    <FormControl>
                      <Typography variant="caption" fontSize={14} mb={1}>
                        Email
                      </Typography>
                      <TextField
                        id="emailId"
                        name="emailId"
                        placeholder="Email"
                        autoComplete="off"

                        value={formik.values.emailId}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.emailId &&
                          Boolean(formik.errors.emailId)
                        }
                       
                      />
                      <FormHelperText sx={{ height: "7px", color: "red" }}>
                        {formik.touched.emailId && formik.errors.emailId}
                      </FormHelperText>
                    </FormControl>
                    <FormControl>
                      <Typography variant="caption" fontSize={14} mb={1}>
                        Position
                      </Typography>
                      <TextField
                        id="position"
                        name="position"
                        autoComplete="off"

                        placeholder="Position"
                        value={formik.values.position}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.position &&
                          Boolean(formik.errors.position)
                        }
                      
                      />
                      <FormHelperText sx={{ height: "7px", color: "red" }}>
                        {formik.touched.position && formik.errors.position}
                      </FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
              {/* Action Buttons */}
              <SaveCancelGroupBtn
                onCancel={handleFormClose}
                pending={isPending}
              />
            </form>
          </Box>
        </Box>
      </Modal>
      <AdminOtpVerification
        email={email}
        open={otpModalOpen}
        handleClose={() => setOtpModalOpen(false)}
      />
    </Box>
  );
};

export default AddAdminForm;
