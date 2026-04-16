import { useCallback, useEffect, useRef, useState } from "react";
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
import { RiCloseLargeLine } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAddAdvertise } from "../../services/steigenApisService";
import { toast } from "react-toastify";
import { Modalstyle } from "../../theme/styles";
import { capitalizeWord } from "../../shared/helper";
import SaveCancelGroupBtn from "../button/SaveCancelGroupBtn";
import { AxiosError } from "axios";
import heic2any from "heic2any";
import UploadComponent from "../../shared/uploadImageAdvertisement";
type advProps = {
  open: boolean;
  handleClose: () => void;
};
const maxFileSize = 1 * 1024 * 1024 * 1024; // 1 GB

const AddAdvertiseForm = ({ open, handleClose }: advProps) => {
  const { mutate, isPending } = useAddAdvertise();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null); // Reference to AbortController

  const processFile = async (file: File, signal: AbortSignal) => {
    if (file.type === "image/heif" || file.type === "image/heic") {
      try {
        const convertedFilePromise = heic2any({
          blob: file,
          toType: "image/jpeg",
          quality: 1, // Adjust quality as needed
        });

        const convertedFile = await Promise.race([
          convertedFilePromise,
          new Promise((_, reject) =>
            signal.addEventListener("abort", () => {
              reject(new Error("Image conversion aborted"));
            })
          ),
        ]);

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
      } catch (error) {
        console.error("Image conversion failed:", error);
        formik.setFieldError("imageFile", "Image conversion failed.");
      }
    } else {
      formik.setFieldValue("imageFile", file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl); // Set the image preview
    }
  };

  const handleFileRejection = (fileRejection: any) => {
    const rejection = fileRejection[0]?.errors[0];

    setPreviewUrl(null);
    setIsImageLoading(false);
    formik.setFieldTouched("imageFile", true, false);

    if (rejection?.code === "file-invalid-type") {
      formik.setFieldError("imageFile", "Image file type not supported.");
    } else if (rejection?.code === "file-too-large") {
      formik.setFieldError("imageFile", "File size must be under 1 GB.");
    } else {
      formik.setFieldError("imageFile", "File upload failed.");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejection: any) => {
    const handleDrop = async () => {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      setIsImageLoading(true);

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        formik.setFieldError("imageFile", ""); // Clear previous error
        await processFile(file, signal);
      } else if (fileRejection.length > 0) {
        handleFileRejection(fileRejection);
      }

      setIsImageLoading(false);
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

  const formik = useFormik({
    initialValues: {
      advName: "",
      advRedirectLink: "",
      isSubscribed: "",
      priority: 0,
      advType: "",
      imageFile: null,
      advPosition: "",
    },
    validationSchema: Yup.object({
      advName: Yup.string().trim()
        .required("Advertise Name is required")
        .min(2, "Name must be atleast 2 characters").max(50,"Maximum 50 characters allowed").matches(/^[^&*%$@~"]*$/, "& * % $ @ ~ \" are not allowed"),
      advRedirectLink: Yup.string().trim()
        .url("Invalid URL").min(2, "URL must be atleast 2 characters").matches(
          /^(https?:\/\/)(www\.)?([\w.-]+\.[a-zA-Z]{2,})(:\d+)?(\/[^\s]*)?$/,
          "Invalid URL format"
        ).required("Redirect Link is required"),
      isSubscribed: Yup.boolean().required("Subscription Type is required"),
      priority: Yup.number()
        .required("Priority Number is required")
        .min(1, "Priority Number is required")
        .integer("Priority must be an integer"),
      advType: Yup.string().required("Advertise type is required"),
      imageFile: Yup.mixed()
        .required("Image is required")
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
    onSubmit: async (values) => {
      const advData = new FormData();
      advData.append("advName", values.advName);
      advData.append("advRedirectLink", values.advRedirectLink);
      advData.append("isSubscribed", values.isSubscribed.toString());
      advData.append("priority", values.priority.toString());
      advData.append("advType", values.advType);
      advData.append("advPosition", values.advPosition);
      if (values.imageFile) {
        advData.append("imageFile", values.imageFile);
      } else {
        formik.setFieldError("imageFile", "Image File is required");
        return;
      }
      advData.append("isActive", "true");

      mutate(advData, {
        onSuccess: () => {
          toast.success("Advertise added successfully");
          formik.resetForm();
          handleClose();
          setPreviewUrl(null);
        },
        onError: (err: AxiosError) => {
          if (err?.response?.status === 500 || err?.response?.status === 502) {
            toast.error("Server error");
          } else {
            console.log(err);
            toast.error("Error occured while adding video");
          }
        },
      });
    },
  });

  useEffect(() => {
    if (formik.submitCount > 0) {
      const firstErrorField = Object.keys(formik.errors)[0]; // Get first error field
      if (firstErrorField) {
        const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [formik.submitCount, formik.errors]);
  

  const handleFormClose = () => {
    formik.resetForm();
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Abort any ongoing file conversion
    }
    setPreviewUrl(null);
    setIsImageLoading(false);
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
          <Box sx={{ maxHeight: "80vh", overflow: "auto", scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: "5px" }, }}>
            <Box display={"flex"} justifyContent={"space-between"} mt={2}>
              <Typography
                id="modal-modal-title"
                fontWeight={600}
                fontSize={"24px"}
              >
                Add Advertise
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
                        Advertise Name
                      </Typography>
                      <TextField
                        placeholder="Advertise Name"
                        id="advName"
                        name="advName"
                        autoComplete="off"
                        value={formik.values.advName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={
                          formik.touched.advName &&
                          Boolean(formik.errors.advName)
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
                        onBlur={formik.handleBlur}
                        inputProps={{ "aria-label": "Without label" }}
                        placeholder="Subscription Type"
                        aria-placeholder="Subscription Type"
                        error={
                          formik.touched.isSubscribed &&
                          Boolean(formik.errors.isSubscribed)
                        }
                        displayEmpty={true}
                        renderValue={(selected: string) => {
                          if (!selected) {
                            return (
                              <span style={{ color: "grey" }}>
                                Subscription Type
                              </span>
                            );
                          } else if (selected === "false") return "Free";
                          else if (selected === "true") return "Premium";
                        }}
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
                        autoComplete="off"
                        name="advRedirectLink"
                        value={formik.values.advRedirectLink}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
                    <FormControl>
                      <Typography variant="caption" fontSize={14} mb={1}>
                        Advertise Type
                      </Typography>
                      <Select
                        id="advType"
                        name="advType"
                        value={formik.values.advType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        placeholder="Advertise Type"
                        error={
                          formik.touched.advType &&
                          Boolean(formik.errors.advType)
                        }
                        renderValue={(selected: string) => {
                          if (!selected) {
                            return (
                              <span style={{ color: "grey" }}>
                                Advertisement Type
                              </span>
                            );
                          }
                          return capitalizeWord(selected);
                        }}
                      >
                        {formik.values.advType === "" && (
                          <MenuItem disabled value="" />
                        )}
                        <MenuItem value={"feature"}>Feature</MenuItem>
                        <MenuItem value={"promotion"}>Promotion</MenuItem>
                      </Select>
                      <FormHelperText sx={{ height: "7px", color: "red" }}>
                        {formik.touched.advType && formik.errors.advType}
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
                        // displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        placeholder="Priority"
                        error={
                          formik.touched.priority &&
                          Boolean(formik.errors.priority)
                        }
                        renderValue={(selected: number) => {
                          if (!selected) {
                            return (
                              <span style={{ color: "grey" }}>Priority</span>
                            );
                          }
                          return selected;
                        }}
                      >
                        {/* {formik.values.priority === "" && ( */}
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
                        onChange={(e) =>
                          formik.setFieldValue("advPosition", e.target.value)
                        }
                        onBlur={formik.handleBlur}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        placeholder="Position"
                        error={
                          formik.touched.advPosition &&
                          Boolean(formik.errors.advPosition)
                        }
                        renderValue={(selected: string) => {
                          if (!selected) {
                            return (
                              <span style={{ color: "grey" }}>Position</span>
                            );
                          }
                          return (
                            selected.charAt(0).toUpperCase() + selected.slice(1)
                          );
                        }}
                      >
                        <MenuItem value={"top"}>Top</MenuItem>
                        <MenuItem value={"bottom"}>Bottom</MenuItem>
                      </Select>
                      <FormHelperText sx={{ height: "7px", color: "red" }}>
                        {formik.touched.advPosition &&
                          formik.errors.advPosition}
                      </FormHelperText>
                    </FormControl>
                    <FormControl>
                      <Box mt={2} position="relative">
                        <Typography
                          variant="caption"
                          fontSize={14}
                          mt={2}
                          mb={1}
                        >
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

                        {formik.touched.imageFile &&
                          formik.errors.imageFile &&
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
              {/* Action Buttons */}
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

export default AddAdvertiseForm;
