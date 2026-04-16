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
  FormControlLabel,
  Switch,
  Chip,
  Autocomplete,
  Avatar,
  IconButton,
} from "@mui/material";
import { RiCloseLargeLine } from "react-icons/ri";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEditFacilityDataRequest } from "../../services/steigenApisService";
import { toast } from "react-toastify";
import { Modalstyle } from "../../theme/styles";
import SaveCancelGroupBtn from "../button/SaveCancelGroupBtn";
import { AxiosError } from "axios";
import heic2any from "heic2any";
import { MdCrop, MdOutlineUploadFile } from "react-icons/md";
import CropImageModal from "../modals/CropImageModal";

export type FaciltyFormEdit = {
  primaryName: string;
  secondaryName: string;
  phoneNumber: string;
  address: string;
  pinCode: string;
  speciality: string[];
  facilityType: string;
  status: boolean;
  imageURL: string;
};

type modalProps = {
  open: boolean;
  handleClose: () => void;
  facilityId: number;
  facData: FaciltyFormEdit;
};

const NewEditFacilityForm = ({
  open,
  handleClose,
  facilityId,
  facData,
}: modalProps) => {
  const tagsArray = [
    { title: "General" },
    { title: "Neurology" },
    { title: "Pathalogy" },
  ];

  const maxFileSize = 7 * 1024 * 1024; // 7 MB
  const { mutate, isPending } = useEditFacilityDataRequest();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [openImgCrop, setOpenImgCrop] = useState<boolean>(false);
  const [originalFileName, setOriginalFileName] = useState<string | null>(null);
  const [cropModalImage, setCropModalImage] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null); // Reference to AbortController

  const checkImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const isValid = img.width >= 400 && img.height >= 400;
        resolve(isValid);
      };
    });
  };

  const formik = useFormik({
    initialValues: {
      facPrimaryName: facData.primaryName,
      facSecondaryName: facData.secondaryName,
      facPhoneNumber: facData.phoneNumber,
      facAddress: facData.address,
      facPincode: facData.pinCode,
      facSpeciality: facData.speciality,
      facType: facData.facilityType,
      isActive: facData.status,
      imageFile: null as File | null,
      initialImage: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      facPrimaryName: Yup.string().trim()
        .required("Primary Name is required")
        .min(2, "Name must be atleast 2 characters").max(50,"Maximum 50 characters allowed").matches(/^[^&*%$@~"]*$/, "& * % $ @ ~ \" are not allowed"),
      facSecondaryName: Yup.string().trim()
        .required("Secondary Name is required")
        .min(2, "Name must be atleast 2 characters").max(50,"Maximum 50 characters allowed").matches(/^[^&*%$@~"]*$/, "& * % $ @ ~ \" are not allowed"),
      facPhoneNumber: Yup.string()
    .matches(/^\d{10,11}$/, "Phone Number should be max 11 digits")
        .required("Phone Number is required"),
      facAddress: Yup.string().trim()
        .min(2, "Address must be atleast 2 characters")
        .max(200, "Address must be at most 200 characters")
        .required("Address is required"),
      facPincode: Yup.string()
        .matches(/^\d+$/, "Pin Code should contain only digits")
        .max(6, "Pincode must contain 6 digits")
        .required("Pin Code is required"),
      facSpeciality: Yup.array()
        .of(Yup.string())
        .min(1, "At least one speciality is required").max(10, "Maximum 10 specialities can be added"),
      facType: Yup.string().required("Type is required"),
      isActive: Yup.string().required("Status is required"),
      imageFile: Yup.mixed()
        .nullable()
        .test("fileSize", "File size must be under 7 MB", (value) => {
          if (!value) return true; // Triggers required error
          const file = value as File;
          return file.size <= maxFileSize; // Ensure size is valid
        })
        .test(
          "imageDimensions",
          "Image must be at least 400x400 pixels",
          (value) => {
            if (!value) return true; // Allow no image to be uploaded
            const file = value as File;
            return new Promise((resolve) => {
              const img = new Image();
              img.src = URL.createObjectURL(file);
              img.onload = () => {
                const isValid = img.width >= 400 && img.height >= 400;
                resolve(isValid);
              };
            });
          }
        ),
    }),

    onSubmit: (values) => {
      const updatedFacility = new FormData();
      updatedFacility.append("facPrimaryName", values.facPrimaryName);
      updatedFacility.append("facSecondaryName", values.facSecondaryName);
      updatedFacility.append(
        "facPhoneNumber",
        values.facPhoneNumber.toString()
      );
      updatedFacility.append("facAddress", values.facAddress);
      updatedFacility.append("facPincode", values.facPincode);
      if (values.facSpeciality && values.facSpeciality.length > 0) {
        values.facSpeciality.forEach((speciality: any, index: any) => {
          updatedFacility.append(`facSpeciality[${index}]`, speciality);
        });
      }
      updatedFacility.append("facType", values.facType);
      updatedFacility.append("isActive", values.isActive.toString());
      if (values.imageFile) {
        updatedFacility.append("imageFile", values.imageFile);
      }

      mutate(
        { facilityId, updatedFacility },
        {
          onSuccess: () => {
            toast.success("Facility edited successfully");
            handleClose();
            formik.resetForm();
          },
          onError: (err: AxiosError) => {
            if (err?.response?.status === 500) {
              toast.error("Server error");
            } else if (err?.response?.status === 404) {
              toast.error("The facilty you are trying to edit does not exist.");
            } else {
              toast.error("Error occurred while editting facility");
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

        const valid = await checkImageDimensions(finalFile);

        if (!valid) {
          formik.setFieldError(
            "imageFile",
            "Image must be at least 400x400 pixels"
          );
          return;
        }

        formik.setFieldValue("imageFile", finalFile);

        const previewUrl = URL.createObjectURL(finalFile);
        formik.setFieldValue("initialImage", previewUrl);

        setPreviewUrl(previewUrl); // Set the converted image preview

        // Open crop modal
        setCropModalImage(previewUrl);
        setOpenImgCrop(true);
      } catch (error) {
        console.error("Image conversion failed:", error);
        formik.setFieldError("imageFile", "Image conversion failed.");
      }
    } else {
      const valid = await checkImageDimensions(file);

      if (!valid) {
        formik.setFieldError(
          "imageFile",
          "Image must be at least 400x400 pixels"
        );
        return;
      }
      formik.setFieldValue("imageFile", file);

      const previewUrl = URL.createObjectURL(file);
      formik.setFieldValue("initialImage", previewUrl);

      setPreviewUrl(previewUrl); // Set the converted image preview
      // Set the image preview
      // Open crop modal
      setCropModalImage(previewUrl);
      setOpenImgCrop(true);
    }
  };

  const handleFileRejection = (fileRejection: any) => {
    const rejection = fileRejection[0]?.errors[0];

    setPreviewUrl(null); // Clear the preview
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

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        formik.setFieldError("imageFile", ""); // Clear previous error
        // Add dimension validation before setting Image
        setOriginalFileName(file.name);
        await processFile(file, signal);
      } else if (fileRejection.length > 0) {
        handleFileRejection(fileRejection);
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
    handleClose();
  };

  const handleOpenImageCrop = () => {
    setOpenImgCrop(true);
    setCropModalImage(formik.values.initialImage);
  };

  const handleCloseImageCrop = () => {
    setOpenImgCrop(false);
  };

  const handleCropComplete = (croppedFile: File) => {
    if (originalFileName) {
      const newFileName = originalFileName.replace(/\.[^.]+$/, `.jpg`); // Keep original name

      const renamedCroppedFile = new File([croppedFile], newFileName, {
        type: croppedFile.type,
      });

      formik.setFieldValue("imageFile", renamedCroppedFile);
      const previewUrl = URL.createObjectURL(renamedCroppedFile);
      setPreviewUrl(previewUrl);
    } else {
      formik.setFieldValue("imageFile", croppedFile);
      const previewUrl = URL.createObjectURL(croppedFile);
      setPreviewUrl(previewUrl);
    }
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
              Edit Facility
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
                      Primary Name
                    </Typography>
                    <TextField
                      placeholder="Primary Name"
                      id="facPrimaryName"
                      name="facPrimaryName"
                      value={formik.values.facPrimaryName}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.facPrimaryName &&
                        Boolean(formik.errors.facPrimaryName)
                      }
                    />
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.facPrimaryName &&
                        formik.errors.facPrimaryName}
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <Typography variant="caption" fontSize={14} mb={1}>
                      Phone Number
                    </Typography>
                    <TextField
                      placeholder="Phone Number"
                      id="facPhoneNumber"
                      name="facPhoneNumber"
                      value={formik.values.facPhoneNumber}
                      onChange={formik.handleChange}
                      inputProps={{ maxLength: 11 }}
                      error={
                        formik.touched.facPhoneNumber &&
                        Boolean(formik.errors.facPhoneNumber)
                      }
                    />
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.facPhoneNumber &&
                        formik.errors.facPhoneNumber}
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <Typography variant="caption" fontSize={14} mb={1}>
                      Pin Code
                    </Typography>
                    <TextField
                      placeholder="Pin Code"
                      id="facPincode"
                      name="facPincode"
                      value={formik.values.facPincode}
                      onChange={formik.handleChange}
                      inputProps={{ maxLength: 6 }}
                      error={
                        formik.touched.facPincode &&
                        Boolean(formik.errors.facPincode)
                      }
                    />
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.facPincode && formik.errors.facPincode}
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <Typography variant="caption" fontSize={14} mb={1}>
                      Speciality
                    </Typography>
                    <Autocomplete
                      multiple
                      id="free-solo-with-text-demo"
                      options={tagsArray.map((option) => option.title)}
                      freeSolo
                      limitTags={4}
                      value={formik.values.facSpeciality}
                      onChange={(_event, value) => {
                        const trimmedValues = value.map((tag) => tag.trim());
  
                        // Check for any tag exceeding 45 characters
                        const tooLongTag = trimmedValues.find(
                          (tag) => tag.length > 45
                        );
  
                        if (tooLongTag) {
                          formik.setFieldError(
                            "facSpeciality",
                            "Speciality can’t exceed 45 characters"
                          );
                        } else {
                          const filtered = trimmedValues.filter(
                            (tag) => tag.length > 1
                          );
                          formik.setFieldValue("facSpeciality", filtered);
                          formik.setFieldError("facSpeciality", ""); // Clear error if fixed
                        }
                      }}
                      renderTags={() => null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="filled"
                          placeholder={"Add Tags"}
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
                            formik.touched.facSpeciality &&
                              formik.errors.facSpeciality
                          )}
                        />
                      )}
                      sx={{
                        "& .MuiInputBase-root": {
                          p: 1,
                          backgroundColor: "#ffffff",
                          mt: 1,
                          border: "1px solid grey",
                          // minWidth: "550px",
                        },
                      }}
                    />
                    {Boolean(formik.values.facSpeciality?.length) && (
                      <Box
                        mt={1}
                        display="flex"
                        flexWrap="wrap"
                        gap={1}
                        sx={{
                          maxHeight: "85px",
                          overflow: "auto",
                          scrollbarWidth: "thin",
                          "&::-webkit-scrollbar": { width: "5px" },
                        }}
                      >
                        {formik.values.facSpeciality?.map(
                          (option: string, index: number) => (
                            <Chip
                              key={`${option}-${index}`}
                              label={option}
                              onDelete={() =>
                                formik.setFieldValue(
                                  "facSpeciality",
                                  formik.values.facSpeciality?.filter(
                                    (tag: string) => tag !== option
                                  )
                                )
                              }
                              sx={{
                                backgroundColor: "#fff8f0",
                                border: "none",
                              }}
                            />
                          )
                        )}
                      </Box>
                    )}
                       <FormHelperText sx={{ height: "7px", color: "red", mb:2 }}>
                      {formik.touched.facSpeciality &&
                        formik.errors.facSpeciality}
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
                      Secondary Name
                    </Typography>
                    <TextField
                      placeholder="Secondary Name"
                      id="facSecondaryName"
                      name="facSecondaryName"
                      value={formik.values.facSecondaryName}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.facSecondaryName &&
                        Boolean(formik.errors.facSecondaryName)
                      }
                    />
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.facSecondaryName &&
                        formik.errors.facSecondaryName}
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <Typography variant="caption" fontSize={14} mb={1}>
                      Address
                    </Typography>
                    <TextField
                      placeholder="Address"
                      id="facAddress"
                      name="facAddress"
                      value={formik.values.facAddress}
                      onChange={formik.handleChange}
                      error={
                        formik.touched.facAddress &&
                        Boolean(formik.errors.facAddress)
                      }
                    />
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.facAddress && formik.errors.facAddress}
                    </FormHelperText>
                  </FormControl>
                  <FormControl>
                    <Typography variant="caption" fontSize={14} mb={1}>
                      Type
                    </Typography>
                    <Select
                      id="facType"
                      name="facType"
                      value={formik.values.facType}
                      onChange={formik.handleChange}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      placeholder="Type"
                      error={
                        formik.touched.facType && Boolean(formik.errors.facType)
                      }
                    >
                      <MenuItem value={"clinic/hospital"}>
                        Clinic / Hospital
                      </MenuItem>
                      <MenuItem value={"doctor"}>Doctor</MenuItem>
                      <MenuItem value={"laboratory"}>Laboratory</MenuItem>
                    </Select>
                    <FormHelperText sx={{ height: "7px", color: "red" }}>
                      {formik.touched.facType && formik.errors.facType}
                    </FormHelperText>
                  </FormControl>

                  <FormControl>
                    <Typography variant="caption" fontSize={14} mb={1}>
                      Upload Profile Image
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      height="80px"
                      border="2px dashed lightgrey"
                      borderRadius={"20px"}
                      bgcolor="#ffffff"
                      maxHeight={"52px"}
                      position="relative"
                      overflow="hidden"
                      {...getRootProps()}
                      mt={1}
                    >
                      <input {...getInputProps()} />
                      <Box display="flex" alignItems="center" gap={1}>
                        <MdOutlineUploadFile color="#FFB374" size={20} />
                        <Typography
                          fontSize={17}
                          fontWeight={500}
                          color="#979DA0"
                        >
                          Upload
                        </Typography>
                      </Box>
                    </Box>
                    <Typography fontSize={10} mt={0.5}>
                      {" "}
                      (Support JPG, PNG, JPEG, SVG, HEIF And HEIC.)
                    </Typography>
                    <Typography
                      sx={{
                        height: "7px",
                        color:
                          formik.errors.imageFile ===
                          "Image must be at least 400x400 pixels"
                            ? "red"
                            : "#979DA0",
                        fontSize: 12,
                      }}
                    >
                      Image must be at least 400x400 pixels
                    </Typography>
                    <Box
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      {formik.errors.imageFile !=
                        "Image must be at least 400x400 pixels" && (
                        <Box display={"flex"} alignItems={"center"} gap={1}>
                          <Box mt={2} display="flex" justifyContent="center">
                            <Avatar
                              src={previewUrl ?? facData.imageURL}
                              alt="Uploaded Image"
                              sx={{
                                width: 45,
                                height: 45,
                              }}
                            />
                          </Box>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            mt={2}
                            fontSize={14}
                            flexWrap={"wrap"}
                            sx={{
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              maxWidth: "155px",
                            }}
                          >
                            {formik.values?.imageFile?.name ??
                              facData.imageURL?.split("/").pop()?.split("_")[1]}
                          </Typography>
                        </Box>
                      )}
                      {formik.errors.imageFile !=
                        "Image must be at least 400x400 pixels" &&
                        formik.values.imageFile !== null && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              height: "35px",
                              mt: 2,
                            }}
                          >
                            <IconButton
                              disableRipple
                              onClick={handleOpenImageCrop}
                            >
                              <MdCrop size={20} />
                            </IconButton>
                          </Box>
                        )}
                    </Box>
                    {formik.errors.imageFile &&
                      formik.errors.imageFile !=
                        "Image must be at least 400x400 pixels" && (
                        <FormHelperText
                          sx={{ height: "7px", color: "red", mt: "10px" }}
                        >
                          {formik.errors.imageFile}
                        </FormHelperText>
                      )}
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
            <SaveCancelGroupBtn
              onCancel={handleFormClose}
              pending={isPending}
            />
          </form>
          <CropImageModal
            openImgCrop={openImgCrop}
            handleCloseImgCrop={handleCloseImageCrop}
            uploadedImage={cropModalImage}
            onCropComplete={handleCropComplete}
          />
        </Box>
      </Box>
    </Modal>
  );
};

export default NewEditFacilityForm;
