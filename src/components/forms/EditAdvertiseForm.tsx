import { useCallback, useEffect, useState } from "react";
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
  FormControlLabel,
  Switch,
} from "@mui/material";
import { RiCloseLargeLine } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEditAdvertiseDataRequest } from "../../services/steigenApisService";
import { toast } from "react-toastify";
import { Modalstyle } from "../../theme/styles";
import SaveCancelGroupBtn from "../button/SaveCancelGroupBtn";
import { AxiosError } from "axios";
import heic2any from "heic2any";
import UploadComponent from "../../shared/uploadImageAdvertisement";

type advDataProps = {
  id: number;
  title: string;
  link: string;
  redirectLink: string;
  priority: string;
  position: string;
  status: boolean;
  subscriptionType: string;
};

type modalProps = {
  open: boolean;
  handleClose: () => void;
  advertiseId: number;
  advData: advDataProps;
};

const EditAdvertiseForm = ({
  open,
  handleClose,
  advertiseId,
  advData,
}: modalProps) => {
  const maxFileSize = 1 * 1024 * 1024 * 1024; // 1 GB
  const { mutate, isPending } = useEditAdvertiseDataRequest();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      advName: advData.title,
      isSubscribed: advData.subscriptionType,
      advRedirectLink: advData.redirectLink,
      priority: advData.priority,
      advPosition: advData.position,
      isActive: advData.status,
      imageFile: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      advName: Yup.string().trim()
        .required("Advertise Name is required")
        .min(2, "Name must be atleast 2 characters").max(50,"Maximum 50 characters allowed").matches(/^[^&*%$@~"]*$/, "& * % $ @ ~ \" are not allowed"),
      advRedirectLink: Yup.string().trim()
        .url("Invalid URL").min(2, "URL must be atleast 2 characters").matches(
          /^(https?:\/\/)(www\.)?([\w.-]+\.[a-zA-Z]{2,})(:\d+)?(\/[^\s]*)?$/,
          "Invalid URL format"
        )
        .required("Redirect Link is required"),
      isSubscribed: Yup.boolean().required("Subscription Type is required"),
      priority: Yup.number()
        .required("Priority Number is required")
        .integer("Priority must be an integer"),
      imageFile: Yup.mixed()
        .nullable()
        .test("fileSize", "File size must be under 1 GB", (value) => {
          if (!value) return true; // Triggers required error
          const file = value as File;
          return file.size <= maxFileSize; // Ensure size is valid
        })
        .test("imageDimensions", "Image must be 686 x 250 pixels", (value) => {
          if (!value) return true; // Allow no image to be uploaded
          const file = value as File;
          return new Promise((resolve) => {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
              const isValid = img.width == 686 && img.height == 250;
              resolve(isValid);
            };
          });
        }),
      advPosition: Yup.string().required("Position is required"),
    }),

    onSubmit: (values) => {
      const advFormData = new FormData();

      advFormData.append("advName", values.advName);
      advFormData.append("isSubscribed", values.isSubscribed);
      advFormData.append("advRedirectLink", values.advRedirectLink);
      advFormData.append("priority", values.priority);
      advFormData.append("advPosition", values.advPosition);
      advFormData.append("isActive", values.isActive.toString());

      if (values.imageFile) {
        advFormData.append("imageFile", values.imageFile);
      }

      mutate(
        { advertiseId, advFormData },
        {
          onSuccess: () => {
            toast.success("Advertise edited successfully");
            handleClose();
            formik.resetForm();
          },
          onError: (err: AxiosError) => {
            if (
              err?.response?.status === 500 ||
              err?.response?.status === 502
            ) {
              toast.error("Server error");
            } else if (err?.response?.status === 404) {
              toast.error(
                "The advertisement you are trying to edit does not exist."
              );
            } else {
              console.log(err);
              toast.error("Error occurred while editting advertisement");
            }
          },
        }
      );
    },
  });

  useEffect(() => {
    if (formik.submitCount > 0) {
      const firstErrorField = Object.keys(formik.errors)[0]; // Get first error field
      if (firstErrorField) {
        const errorElement = document.querySelector(
          `[name="${firstErrorField}"]`
        );
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [formik.submitCount, formik.errors]);

  const onDrop = useCallback((acceptedFiles: File[], fileRejection: any) => {

    const handleDrop = async () => {
      setIsImageLoading(true);

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0]; // Only take the first file

        formik.setFieldError("imageFile", ""); // Clear previous error
        if (file.type === "image/heif" || file.type === "image/heic") {
          const convertedFile = await heic2any({
            blob: file,
            toType: "image/jpeg",
            quality: 1, // Adjust quality as needed
          });

          const finalImageUrl = Array.isArray(convertedFile)
            ? convertedFile[0]
            : convertedFile;

          const finalFile = new File(
            [finalImageUrl],
            file.name.replace(/\.[^.]+$/, ".jpg"),
            { type: "image/jpeg" }
          );

          formik.setFieldValue("imageFile", finalFile);

          const previewUrl = URL.createObjectURL(finalFile);

          setPreviewUrl(previewUrl); // Set the converted image preview
          setIsImageLoading(false);
        } else {
          formik.setFieldValue("imageFile", file);
          const previewUrl = URL.createObjectURL(file);
          setPreviewUrl(previewUrl); // Set the image preview
          setIsImageLoading(false);
        }
      } else if (fileRejection.length > 0) {
        const rejection = fileRejection[0].errors[0]; // Get the first rejection error

        setPreviewUrl(null); // Clear the preview
        setIsImageLoading(false);
        // Set the appropriate error message based on the rejection reason
        if (rejection.code === "file-invalid-type") {
          formik.setFieldError("imageFile", "Image file type not supported.");
        } else if (rejection.code === "file-too-large") {
          formik.setFieldError("imageFile", "File size must be under 1 GB.");
        } else {
          formik.setFieldError("imageFile", "File upload failed.");
        }
      }
    };

    handleDrop();
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "text/html": [".html", ".htm"],
      "image/jpeg": [".jpeg"],
      "image/jpg": [".jpg"],
      "image/svg+xml": [".svg"],
      "image/heif": [".heif"],
      "image/heic": [".heic"],
    },
    onDrop,
    multiple: false, // Ensures only one file can be uploaded
  });
  const handleFormClose = () => {
    formik.resetForm();
    setPreviewUrl(null);
    setIsImageLoading(false);
    handleClose();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={Modalstyle}>
        <Box
          sx={{
            maxHeight: "80vh",
            overflow: "auto",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: "5px" },
          }}
        >
          <Box display={"flex"} justifyContent={"space-between"} mt={2}>
            <Typography
              id="modal-modal-title"
              fontWeight={600}
              fontSize={"24px"}
            >
              Edit Advertise
            </Typography>
            <RiCloseLargeLine
              style={{ cursor: "pointer", paddingTop: "10px" }}
              onClick={handleFormClose}
            />
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Box display={"flex"} gap={1}>
              <Typography variant="caption" fontSize={16} mt={1}>
                Status:
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.isActive}
                    onChange={(e) =>
                      formik.setFieldValue("isActive", e.target.checked)
                    }
                    color="warning"
                  />
                }
                label="Active"
                sx={{ mt: 0.5 }}
              />
            </Box>
            <Paper
              sx={{ mt: 4, borderRadius: "10px" }}
              elevation={2}
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
                      Advertise Name
                    </Typography>
                    <TextField
                      placeholder="Advertise Name"
                      id="advName"
                      name="advName"
                      value={formik.values.advName}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.advName && Boolean(formik.errors.advName)
                      }
                    />
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.advName && formik.errors.advName}
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <Typography variant="caption" fontSize={14} mb={1}>
                      Subscription Type
                    </Typography>
                    <Select
                      id="isSubscribed"
                      name="isSubscribed"
                      value={formik.values.isSubscribed}
                      onChange={formik.handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      placeholder="Subscription Type"
                      error={
                        formik.touched.isSubscribed &&
                        Boolean(formik.errors.isSubscribed)
                      }
                    >
                      <MenuItem value={"false"}>Free</MenuItem>
                      <MenuItem value={"true"}>Premium</MenuItem>
                    </Select>
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.isSubscribed &&
                        formik.errors.isSubscribed}
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <Typography variant="caption" fontSize={14} mb={1}>
                      Redirect Link
                    </Typography>
                    <TextField
                      placeholder="Redirect Link"
                      id="advRedirectLink"
                      name="advRedirectLink"
                      value={formik.values.advRedirectLink}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.advRedirectLink &&
                        Boolean(formik.errors.advRedirectLink)
                      }
                    />
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.advRedirectLink &&
                        formik.errors.advRedirectLink}
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
                      Priority Number
                    </Typography>
                    <Select
                      id="priority"
                      name="priority"
                      value={formik.values.priority}
                      onChange={formik.handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      placeholder="Priority"
                      error={
                        formik.touched.priority &&
                        Boolean(formik.errors.priority)
                      }
                    >
                      <MenuItem value={0}>0</MenuItem>
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={2}>2</MenuItem>
                      <MenuItem value={3}>3</MenuItem>
                      <MenuItem value={4}>4</MenuItem>
                      <MenuItem value={5}>5</MenuItem>
                    </Select>
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.priority && formik.errors.priority}
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <Typography variant="caption" fontSize={14} mb={1}>
                      Position
                    </Typography>
                    <Select
                      id="advPosition"
                      name="advPosition"
                      value={formik.values.advPosition}
                      onChange={formik.handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      placeholder="Position"
                      error={
                        formik.touched.advPosition &&
                        Boolean(formik.errors.advPosition)
                      }
                    >
                      <MenuItem value={"top"}>Top</MenuItem>
                      <MenuItem value={"bottom"}>Bottom</MenuItem>
                    </Select>
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.advPosition && formik.errors.advPosition}
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <Box position="relative">
                      <Typography variant="caption" fontSize={14} mt={2} mb={1}>
                        Upload Photo{" "}
                        <Typography fontSize={10}>
                          {" "}
                          (Support JPG, PNG, JPEG, SVG, HEIF And HEIC.)
                        </Typography>
                      </Typography>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        height="200px"
                        border="2px solid lightgrey"
                        borderRadius={"20px"}
                        bgcolor="#ffffff"
                        maxHeight={"95px"}
                        mt={1}
                        position="relative"
                        overflow="hidden"
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        {UploadComponent({
                          isImageLoading,
                          previewUrl,
                          advDataLink: advData.link,
                        })}
                      </Box>
                      <FormHelperText
                        sx={{
                          height: "7px",
                          color:
                            formik.errors.imageFile ===
                            "Image must be 686 x 250 pixels"
                              ? "red"
                              : "#979DA0",
                        }}
                      >
                        Image must be 686 x 250 pixels
                      </FormHelperText>
                      {formik.errors.imageFile &&
                        formik.errors.imageFile !=
                          "Image must be 686 x 250 pixels" && (
                          <FormHelperText
                            sx={{ height: "7px", color: "red", mt: "10px" }}
                          >
                            {formik.errors.imageFile}
                          </FormHelperText>
                        )}
                    </Box>
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

export default EditAdvertiseForm;
