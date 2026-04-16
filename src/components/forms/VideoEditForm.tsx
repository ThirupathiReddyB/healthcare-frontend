import {
  Box,
  Modal,
  Typography,
  Grid,
  FormControl,
  TextField,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  Paper,
  FormHelperText,
  FormControlLabel,
  Switch,
} from "@mui/material";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";

import { RiCloseLargeLine } from "react-icons/ri";
import { useEditVideoDataRequest } from "../../services/steigenApisService";
import { toast } from "react-toastify";
import { Modalstyle } from "../../theme/styles";
import { VideoData } from "../../shared/types/contentManagement";
import SaveCancelGroupBtn from "../button/SaveCancelGroupBtn";
import { AxiosError } from "axios";

const VideoEditForm = ({
  openEdit,
  handleCloseEditForm,
  videoData,
}: {
  openEdit: boolean;
  handleCloseEditForm: any;
  videoData: VideoData;
}) => {
  const videoId = videoData?.id;
  const { mutate, isPending } = useEditVideoDataRequest();

  const [initialValues, setInitialValues] = useState({
    vidName: "",
    vidSourceUrl: "",
    vidTags: [] as string[],
    isSubscribed: "false",
    priority: 0,
    isActive: false,
  });

  useEffect(() => {
    if (videoData) {
      setInitialValues({
        vidName: videoData.vidName,
        vidSourceUrl: videoData.vidSourceUrl,
        vidTags: videoData.vidTags,
        isSubscribed: videoData.isSubscribed.toString(),
        priority: videoData.priority,
        isActive: videoData.isActive,
      });
    }
  }, [videoData]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object({
      vidName: Yup.string()
        .trim()
        .min(2, "Name must be atleast 2 characters")
        .max(50, "Maximum 50 characters allowed").matches(/^[^&*%$@~"]*$/, "& * % $ @ ~ \" are not allowed")
        .required("Video Name is required"),
      vidSourceUrl: Yup.string()
        .trim()
        .min(2, "URL must be atleast 2 characters")
        .matches(
          /^https:\/\/vimeo\.com\/\d+\s*$/,
          "Video URL does not exist on vimeo."
        )
        .url("Invalid URL")
        .required("Video Link is required"),
      vidTags: Yup.array()
        .of(Yup.string())
        .min(1, "At least one tag is required")
        .max(15, "Maximum 15 tags can be added")
        .required("At least one tag is required"),
      isSubscribed: Yup.string().required("Subscription Type is required"),
      priority: Yup.number().required("Priority Number is required"),
      isActive: Yup.string().required("Status Type is required"),
    }),
    onSubmit: (values) => {
      const videoValues = {
        ...values,
        vidSourceUrl: values.vidSourceUrl.trimEnd(),
        isSubscribed: values.isSubscribed === "true",
      };

      console.log("val", videoValues);

      mutate(
        { videoId, videoValues },
        {
          onSuccess: () => {
            toast.success("Video edited successfully");
            handleCloseEditForm();
            formik.resetForm();
          },
          onError: (err: AxiosError) => {
            if (
              err?.response?.status === 500 ||
              err?.response?.status === 502
            ) {
              toast.error("Server error");
            } else if (err?.response?.status === 404) {
              toast.error("The video you are trying to edit does not exist.");
            } else {
              const errorMessage = (
                err.response?.data as { error: { message: string } }
              )?.error?.message;

              const formErrorMessage = (
                err.response?.data as {
                  formError: { fieldName: string; message: string };
                }
              )?.formError;

              console.log(err);
              toast.error(errorMessage || "Error occured while editing video");
              if (formErrorMessage?.fieldName === "vidSourceUrl")
                formik.setFieldError(
                  "vidSourceUrl",
                  formErrorMessage.message ||
                    "Video URL does not exist on vimeo"
                );
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

  const tagsArray = [{ title: "Health" }, { title: "Medicine" }];

  const handleFormClose = () => {
    formik.resetForm();
    handleCloseEditForm();
  };

  return (
    <Box>
      <Modal
        open={openEdit}
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
                Edit Video
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
                elevation={0}
                variant="outlined"
              >
                <Grid container spacing={1} p={3}>
                  <Grid container spacing={2} px={1} pt={2}>
                    <Grid item xs={5}>
                      <FormControl>
                        <Typography variant="caption" fontSize={14} mb={1}>
                          Video Name
                        </Typography>
                        <TextField
                          placeholder="Video Name"
                          {...formik.getFieldProps("vidName")}
                          error={
                            formik.touched.vidName &&
                            Boolean(formik.errors.vidName)
                          }
                        />
                        <FormHelperText sx={{ height: "7px", color: "red" }}>
                          {formik.touched.vidName && formik.errors.vidName}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <FormControl sx={{ width: "100%" }}>
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
                          <MenuItem value={1}>1</MenuItem>
                          <MenuItem value={2}>2</MenuItem>
                          <MenuItem value={3}>3</MenuItem>
                          <MenuItem value={4}>4</MenuItem>
                          <MenuItem value={5}>5</MenuItem>
                        </Select>
                        {formik.touched.priority && formik.errors.priority ? (
                          <Typography color="error" variant="caption">
                            {formik.errors.priority}
                          </Typography>
                        ) : null}
                        <FormHelperText sx={{ height: "7px", color: "red" }}>
                          {formik.touched.priority && formik.errors.priority}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl sx={{ width: "100%" }}>
                        <Typography variant="caption" fontSize={14} mb={1}>
                          Subscription Type
                        </Typography>
                        <Select
                          id="isSubscribed"
                          name="isSubscribed"
                          value={formik.values.isSubscribed}
                          onChange={formik.handleChange}
                          displayEmpty
                          fullWidth
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
                        {formik.touched.isSubscribed &&
                        formik.errors.isSubscribed ? (
                          <Typography color="error" variant="caption">
                            {formik.errors.isSubscribed}
                          </Typography>
                        ) : null}
                        <FormHelperText sx={{ height: "7px", color: "red" }}>
                          {formik.touched.isSubscribed &&
                            formik.errors.isSubscribed}
                        </FormHelperText>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Grid
                    item
                    xs={12}
                    sx={{
                      "&.MuiGrid-item": {
                        pt: 1, // Another way to ensure it targets this class specifically
                      },
                    }}
                  >
                    <Box width={"100%"}>
                      <FormControl>
                        <Typography variant="caption" fontSize={14} mb={1}>
                          Video Link
                        </Typography>
                        <TextField
                          placeholder="Video Link"
                          {...formik.getFieldProps("vidSourceUrl")}
                          error={
                            formik.touched.vidSourceUrl &&
                            Boolean(formik.errors.vidSourceUrl)
                          }
                          sx={{ minWidth: "550px" }}
                        />
                        <FormHelperText sx={{ height: "7px", color: "red" }}>
                          {formik.touched.vidSourceUrl &&
                            formik.errors.vidSourceUrl}
                        </FormHelperText>
                      </FormControl>
                      <FormControl>
                        <Typography variant="caption" fontSize={14} mb={1}>
                          Tags
                        </Typography>
                        <Autocomplete
                          multiple
                          id="free-solo-with-text-demo"
                          options={tagsArray?.map((option) => option.title)}
                          freeSolo
                          limitTags={4}
                          value={formik.values.vidTags}
                          onChange={(_event, value) => {
                            const trimmedValues = value?.map((tag) => tag.trim());
                          
                            // Regex to match only allowed characters: letters, numbers, and spaces
                            const invalidTag = trimmedValues?.find(
                              (tag) => /[^a-zA-Z0-9 ]/.test(tag)
                            );
                          
                            if (invalidTag) {
                              formik.setFieldError(
                                "vidTags",
                                "Tags can only contain letters, numbers, and spaces"
                              );
                            } else {
                              // Check for tag exceeding 45 characters
                              const tooLongTag = trimmedValues?.find((tag) => tag?.length > 45);
                              if (tooLongTag) {
                                formik.setFieldError(
                                  "vidTags",
                                  "Tags can’t exceed 45 characters"
                                );
                              } else {
                                const filtered = trimmedValues
                                  .filter((tag) => tag?.length > 1)
                                  .filter((tag, index, self) => self.indexOf(tag) === index); // Optional: prevent duplicates
                          
                                formik.setFieldValue("vidTags", filtered);
                                formik.setFieldError("vidTags", ""); // Clear any previous error
                              }
                            }
                          }}
                          
                          renderTags={(value: readonly string[], getTagProps) =>
                            value.map((option: string, index: number) => {
                              const { key, ...tagProps } = getTagProps({
                                index,
                              });
                              return (
                                <Chip
                                  variant="outlined"
                                  label={option}
                                  key={key}
                                  {...tagProps}
                                  sx={{
                                    backgroundColor: "#fff8f0",
                                    border: "none",
                                  }}
                                />
                              );
                            })
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              variant="filled"
                              placeholder={
                                formik.values.vidTags.length > 0
                                  ? ""
                                  : "Add Tags"
                              }
                              sx={{
                                "& .MuiInputBase-root": {
                                  borderRadius: "5px",
                                  "&.Mui-focused": {
                                    background: "transparent",
                                  },
                                  ":hover": {
                                    background: "transparent",
                                  },
                                  "::before": {
                                    display: "none",
                                  },
                                  "::after": {
                                    display: "none",
                                  },
                                },
                              }}
                              error={Boolean(
                                formik.touched.vidTags && formik.errors.vidTags
                              )}
                            />
                          )}
                          sx={{
                            "& .MuiInputBase-root": {
                              p: 1,
                              backgroundColor: "#ffffff",
                              mt: 1,
                              border: "1px solid grey",
                              minWidth: "550px",
                            },
                          }}
                        />
                        <FormHelperText sx={{ height: "7px", color: "red" }}>
                          {formik.touched.vidTags && formik.errors.vidTags}
                        </FormHelperText>
                      </FormControl>
                    </Box>
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
    </Box>
  );
};

export default VideoEditForm;
