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
} from "@mui/material";
import { RiCloseLargeLine } from "react-icons/ri";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddVideo } from "../../services/steigenApisService";
import { toast } from "react-toastify";
import { Modalstyle } from "../../theme/styles";
import SaveCancelGroupBtn from "../button/SaveCancelGroupBtn";
import { AxiosError } from "axios";
import { useEffect } from "react";

type Props = {
  open: boolean;
  handleClose: () => void;
};

const VideoAddForm = ({ open, handleClose }: Props) => {
  const { mutate, isPending } = useAddVideo();

  const tagsArray = [{ title: "Health" }, { title: "Medicine" }];

  const formik = useFormik({
    initialValues: {
      vidName: "",
      vidSourceUrl: "",
      vidTags: [] as string[],
      isSubscribed: "",
      priority: "",
      imageFile: null,
    },
    validationSchema: Yup.object({
      vidName: Yup.string().trim()
        .min(2, "Name must be atleast 2 characters").max(50,"Maximum 50 characters allowed").matches(/^[^&*%$@~"]*$/, "& * % $ @ ~ \" are not allowed")
        .required("Video Name is required"),
      vidSourceUrl: Yup.string().trim()
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
     
    }),
    onSubmit: async (values) => {

      const videoData = {
        ...values,
        vidSourceUrl: values.vidSourceUrl.trimEnd(),
        isSubscribed: values.isSubscribed === "true",
        vidTags: values.vidTags,
        isActive: true,
      };

      mutate(videoData, {
        onSuccess: () => {
          toast.success("Video added successfully");
          handleClose();
          formik.resetForm();
        },
        onError: (err: AxiosError) => {
          if (err?.response?.status === 500 || err?.response?.status === 502) {
            toast.error("Server error");
          } else {
            const errorMessage = (
              err.response?.data as { error: { message: string } }
            )?.error?.message;
            toast.error(errorMessage);

            const formErrorMessage = (
              err.response?.data as {
                formErrror: { message: { fieldName: string; message: string } };
              }
            )?.formErrror;

            if (formErrorMessage.message?.fieldName === "vidSourceUrl") {
              formik.setFieldError(
                "vidSourceUrl",
                formErrorMessage?.message?.message ||
                  "Video URL does not exist on vimeo"
              );
            } else {
              toast.error(errorMessage || "Error occured while adding video");
            }
          }
        },
      });
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
                Add Video
              </Typography>
              <RiCloseLargeLine
                style={{ cursor: "pointer", paddingTop: "10px" }}
                onClick={handleFormClose}
              />
            </Box>

            <form onSubmit={formik.handleSubmit}>
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
                        Video Name
                      </Typography>
                      <TextField
                        placeholder="Video Name"
                        id="vidName"
                        autoComplete="off"
                        name="vidName"
                        value={formik.values.vidName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.vidName &&
                          Boolean(formik.errors.vidName)
                        }
                      />
                      <FormHelperText sx={{ height: "7px", color: "red" }}>
                        {formik.touched.vidName && formik.errors.vidName}
                      </FormHelperText>
                    </FormControl>
                    <FormControl>
                      <Typography variant="caption" fontSize={14} mb={1}>
                        Subscription Type
                      </Typography>
                      <Select
                        id="isSubscribed"
                        name="isSubscribed"
                        value={formik.values.isSubscribed || ""} // Default to empty string
                        onChange={(e) =>
                          formik.setFieldValue("isSubscribed", e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        placeholder="Subscription Type"
                        error={
                          formik.touched.isSubscribed &&
                          Boolean(formik.errors.isSubscribed)
                        }
                        renderValue={(selected: string) => {
                          if (!selected) {
                            return (
                              <span style={{ color: "grey" }}>
                                Subscription Type
                              </span>
                            );
                          }
                          return selected === "true" ? "Premium" : "Free"; // Convert boolean value back to display text
                        }}
                      >
                        {formik.values.isSubscribed === "" && (
                          <MenuItem disabled value="" />
                        )}
                        <MenuItem value={"false"}>Free</MenuItem>
                        <MenuItem value={"true"}>Premium</MenuItem>
                      </Select>
                      <FormHelperText sx={{ height: "7px", color: "red" }}>
                        {formik.touched.isSubscribed &&
                          formik.errors.isSubscribed}
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
                        onBlur={formik.handleBlur}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        placeholder="Priority"
                        error={
                          formik.touched.priority &&
                          Boolean(formik.errors.priority)
                        }
                        renderValue={(selected: string) => {
                          if (!selected) {
                            return (
                              <span style={{ color: "grey" }}>Priority</span>
                            );
                          }
                          return selected;
                        }}
                      >
                        {formik.values.priority === "" && (
                          <MenuItem disabled value="" />
                        )}
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
                        Video Link
                      </Typography>
                      <TextField
                        placeholder="Video Link"
                        id="vidSourceUrl"
                        name="vidSourceUrl"
                        autoComplete="off"
                        value={formik.values.vidSourceUrl}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.vidSourceUrl &&
                          Boolean(formik.errors.vidSourceUrl)
                        }
                      />
                      <FormHelperText sx={{ height: "7px", color: "red" }}>
                        {formik.touched.vidSourceUrl &&
                          formik.errors.vidSourceUrl}
                      </FormHelperText>
                    </FormControl>
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
                        <Typography variant="caption" fontSize={14}>
                          Tags
                        </Typography>
                        <Autocomplete
                          multiple
                          id="vidTags"
                          options={tagsArray.map((option) => option.title)}
                          freeSolo
                          limitTags={4}
                          value={formik.values.vidTags}
                          // onChange={(_event, value) => {
                          //   const trimmedValues = value.map((tag) => tag.trim());
      
                          //   // Check for any tag exceeding 45 characters
                          //   const tooLongTag = trimmedValues.find(
                          //     (tag) => tag.length > 45
                          //   );
      
                          //   if (tooLongTag) {
                          //     formik.setFieldError(
                          //       "vidTags",
                          //       "Tags can’t exceed 45 characters"
                          //     );
                          //   } else {
                          //     const filtered = trimmedValues.filter(
                          //       (tag) => tag.length > 1
                          //     );
                          //     formik.setFieldValue("vidTags", filtered);
                          //     formik.setFieldError("vidTags", ""); // Clear error if fixed
                          //   }
                          // }}
                          onChange={(_event, value) => {
                            const trimmedValues = value?.map((tag) => tag.trim());
                          
                            // Regex to match only allowed characters: letters, numbers, and spaces
                            const invalidTag = trimmedValues.find(
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
                        {formik.touched.vidTags && formik.errors.vidTags && (
                          <FormHelperText sx={{ height: "7px", color: "red" }}>
                            {formik.touched.vidTags && formik.errors.vidTags}
                          </FormHelperText>
                        )}
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

export default VideoAddForm;
