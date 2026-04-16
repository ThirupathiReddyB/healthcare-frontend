import {
  Box,
  Modal,
  Typography,
  Paper,
  Grid,
  FormControl,
  TextField,
} from "@mui/material";
import { RiCloseLargeLine } from "react-icons/ri";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  usePatchEditAdminSelf,
  usePatchEditSuperadminSelf,
} from "../../services/steigenApisService";
import { toast } from "react-toastify";
import { Modalstyle } from "../../theme/styles";
import SaveCancelGroupBtn from "../button/SaveCancelGroupBtn";
import { useAppSelector } from "../../state/store";
import { useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";
import { updateUserData } from "../../state/user/userSlice";

type modalProps = {
  openEdit: boolean;
  handleCloseEditForm: any;
};

const EditUserRoleForm = ({ openEdit, handleCloseEditForm }: modalProps) => {
  const { position, fullName, role } = useAppSelector(
    (state) => state.storeUserData
  );
  const { mutate: mutateAdmin, isPending: isAdminPending } =
    usePatchEditAdminSelf();
  const { mutate: mutateSuperadmin, isPending: isSuperadminPending } =
    usePatchEditSuperadminSelf();
  const dispatch = useDispatch<Dispatch<any>>();

  const [initialValues, setInitialValues] = useState({
    fullName: "",
    position: "",
  });

  useEffect(() => {
    setInitialValues({
      fullName: fullName,
      position: position,
    });
  }, [position, fullName]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      fullName: Yup.string().trim().required("Full Name is required").min(2, "Name must be atleast 2 characters").max(50,"Maximum 50 characters allowed.").matches(/^[A-Za-z ]+$/, "Special characters are not allowed"),
      position: Yup.string().trim().required("Position is required").min(2, "Position must be atleast 2 characters").max(30,"Maximum 30 characters allowed.").matches(/^[A-Za-z ]+$/, "Special characters are not allowed"),
    }),
    onSubmit: (values) => {

      const adminFormData = {
        ...values,
      };

      if (role === "superAdmin") {
        mutateSuperadmin(adminFormData, {
          onSuccess: () => {
            toast.success("Super Admin updated successfully");
            dispatch(
              updateUserData({
                fullName: adminFormData.fullName,
                position: adminFormData.position,
              })
            );
            // close modal
            handleCloseEditForm();
          },
          onError: (err) => {
            toast.error("Error in updating Super Admin details");
            console.log(err);
          },
        });
      } else if (role === "admin") {
        mutateAdmin(adminFormData, {
          onSuccess: () => {
            toast.success("Admin updated successfully");
            dispatch(
              updateUserData({
                fullName: adminFormData.fullName,
                position: adminFormData.position,
              })
            );
            // close modal
            handleCloseEditForm();
          },
          onError: (err) => {
            toast.error("Error in updating Admin details");
            console.log(err);
          },
        });
      }
    },
  });

  const handleFormClose = () => {
    formik.resetForm();
    handleCloseEditForm();
  };

  return (
    <Modal
      open={openEdit}
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
              {role === "superAdmin"
                ? "Edit Super admin details"
                : "Edit Admin details"}{" "}
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
                      placeholder="Name"
                      {...formik.getFieldProps("fullName")}
                      error={
                        formik.touched.fullName &&
                        Boolean(formik.errors.fullName)
                      }
                      helperText={
                        formik.touched.fullName && formik.errors.fullName
                      }
                    />
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
                      Position
                    </Typography>
                    <TextField
                      placeholder="Position"
                      {...formik.getFieldProps("position")}
                      error={
                        formik.touched.position &&
                        Boolean(formik.errors.position)
                      }
                      helperText={
                        formik.touched.position && formik.errors.position
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>

            <SaveCancelGroupBtn
              onCancel={handleFormClose}
              pending={isAdminPending || isSuperadminPending}
            />
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditUserRoleForm;
