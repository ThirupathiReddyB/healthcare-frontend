import {
  Box,
  Modal,
  Typography,
  Paper,
  Grid,
  FormControl,
  TextField,
  FormHelperText,
} from "@mui/material";
import { RiCloseLargeLine } from "react-icons/ri";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useEditAdminDataRequest } from "../../services/steigenApisService";
import { toast } from "react-toastify";
import { Modalstyle } from "../../theme/styles";
import { Admin } from "../tables/AdminAndAuditorTable";
import SaveCancelGroupBtn from "../button/SaveCancelGroupBtn";
import { AxiosError } from "axios";

type modalProps = {
  openEdit: boolean;
  handleCloseEditForm: any;
  adminData: Admin;
};

const EditAdminForm = ({
  openEdit,
  handleCloseEditForm,
  adminData,
}: modalProps) => {
  const adminId = adminData?.id;

  const { mutate, isPending } = useEditAdminDataRequest();

  const [initialValues, setInitialValues] = useState({
    fullName: "",
    position: "",
  });

  useEffect(() => {
    if (adminData) {
      setInitialValues({
        fullName: adminData.fullName,
        position: adminData.position,
      });
    }
  }, [adminData]);

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

      mutate(
        { adminId, adminFormData },
        {
          onSuccess: () => {
            toast.success("Admin/Auditor edited successfully");
            handleCloseEditForm();
            formik.resetForm();
          },
          onError: (err: AxiosError) => {
            if (err?.response?.status === 500) {
              toast.error("Server error");
            } else if (err?.response?.status === 404) {
              toast.error("Admin/Auditor does not exist.");
            } else {
              console.log(err);
              toast.error("Error occurred while editting admin/auditor");
            }
          },
        }
      );
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
              Edit Admin / Auditor
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
                    />
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.fullName && formik.errors.fullName}
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
                      Position
                    </Typography>
                    <TextField
                      placeholder="Position"
                      {...formik.getFieldProps("position")}
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

            <SaveCancelGroupBtn
              onCancel={handleFormClose}
              pending={isPending}
            />
          </form>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditAdminForm;
