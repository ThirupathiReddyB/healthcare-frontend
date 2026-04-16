import {
  Modal,
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  TextField,
  FormHelperText,
  Autocomplete,
  Chip,
  Select,
  MenuItem,
  Avatar,
  IconButton,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineUploadFile, MdCrop } from "react-icons/md";
import { RiCloseLargeLine } from "react-icons/ri";
import { Modalstyle } from "../../theme/styles";
import SaveCancelGroupBtn from "../button/SaveCancelGroupBtn";
import CropImageModal from "../modals/CropImageModal";
import { FaciltyFormAdd } from "../../shared/types/contentManagement";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useAddFacility } from "../../services/steigenApisService";
import { useDropzone } from "react-dropzone";
import heic2any from "heic2any";
import { useFormik } from "formik";
import * as Yup from "yup";
import { capitalizeWord } from "../../shared/helper";

const NewAddFacilityForm = ({
  open,
  handleCloseAddFacForm,
}: {
  open: boolean;
  handleCloseAddFacForm: any;
}) => {
  const tagsArray = [
    { title: "General" },
    { title: "Neurology" },
    { title: "Pathalogy" },
  ];

  const maxFileSize = 7 * 1024 * 1024; // 7 MB

  const { mutate, isPending } = useAddFacility();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
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
      facPrimaryName: "",
      facSecondaryName: "",
      facPhoneNumber: "",
      facAddress: "",
      facPincode: "",
      facSpeciality: [],
      facType: "",
      facImageFile: null as File | null,
      initialImage: null,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      facPrimaryName: Yup.string().trim()
        .required("Primary Name is required")
        .min(2, "Name must be atleast 2 characters").max(50,"Maximum 50 characters allowed").matches(/^[^&*%$@~"]*$/, "& * % $ @ ~ \" are not allowed"),
      facSecondaryName: Yup.string().trim()
        .required("Secondary Name is required")
        .min(2, " Name must be atleast 2 characters").max(50,"Maximum 50 characters allowed").matches(/^[^&*%$@~"]*$/, "& * % $ @ ~ \" are not allowed"),
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
        .min(1, "At least one speciality is required").max(10, "Maximum 10 speciality can be added"),
      facType: Yup.string().required("Type is required"),
      facImageFile: Yup.mixed()
        .required("Profile Image is required")
        .test("fileSize", "File size must be under 7 MB", (value) => {
          if (!value) return true; // Triggers required error
          const file = value as File;
          return file.size <= maxFileSize; // Ensure size is valid
        })
        .test(
          "fileDimensions",
          "Image must be at least 400x400 pixels",
          async (value) => {
            if (!value) return true;
            return await checkImageDimensions(value as File);
          }
        ),
    }),

    onSubmit: (values: FaciltyFormAdd) => {
      const facilityData = new FormData();
      facilityData.append("facPrimaryName", values.facPrimaryName);
      facilityData.append("facSecondaryName", values.facSecondaryName);
      facilityData.append("facPhoneNumber", values.facPhoneNumber.toString());
      facilityData.append("facAddress", values.facAddress);
      facilityData.append("facPincode", values.facPincode);
      if (values.facSpeciality && values.facSpeciality.length > 0) {
        values.facSpeciality.forEach((speciality, index) => {
          facilityData.append(`facSpeciality[${index}]`, speciality);
        });
      }
      facilityData.append("facType", values.facType);
      if (values.facImageFile) {
        facilityData.append("imageFile", values.facImageFile);
      } else {
        formik.setFieldError("facImageFile", "Image File is required");
        return;
      }
      facilityData.append("isActive", "true");

      mutate(facilityData, {
        onSuccess: () => {
          toast.success("Facility added successfully");
          handleCloseAddFacForm();
          formik.resetForm();
          setImagePreview(null);
        },
        onError: (err: AxiosError) => {
          if (err?.response?.status === 500 || err?.response?.status === 502) {
            toast.error("Server error");
          } else if (err?.response?.status === 422) {
            toast.error(
              "It looks like a facility with this phone number already exists."
            );
          } else {
            console.log(err);
            toast.error("Error occurred while adding facility");
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

  const handleCropComplete = (croppedFile: File) => {
    if (originalFileName) {
      const newFileName = originalFileName.replace(/\.[^.]+$/, `.jpg`); // Keep original name

      const renamedCroppedFile = new File([croppedFile], newFileName, {
        type: croppedFile.type,
      });

      formik.setFieldValue("facImageFile", renamedCroppedFile);
      const previewUrl = URL.createObjectURL(renamedCroppedFile);
      setImagePreview(previewUrl);
    } else {
      formik.setFieldValue("facImageFile", croppedFile);
      const previewUrl = URL.createObjectURL(croppedFile);
      setImagePreview(previewUrl);
    }
  };

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
            "facImageFile",
            "Image must be at least 400x400 pixels"
          );
          return;
        }

        formik.setFieldValue("facImageFile", finalFile);

        const previewUrl = URL.createObjectURL(finalFile);
        formik.setFieldValue("initialImage", previewUrl);

        setImagePreview(previewUrl); // Set the converted image preview

        // Open crop modal
        setCropModalImage(previewUrl);
        setOpenImgCrop(true);
      } catch (error) {
        console.error("Image conversion failed:", error);
        formik.setFieldError("facImageFile", "Image conversion failed.");
      }
    } else {
      const valid = await checkImageDimensions(file);

      if (!valid) {
        formik.setFieldError(
          "facImageFile",
          "Image must be at least 400x400 pixels"
        );
        return;
      }
      formik.setFieldValue("facImageFile", file);

      const previewUrl = URL.createObjectURL(file);
      formik.setFieldValue("initialImage", previewUrl);

      setImagePreview(previewUrl); // Set the image preview
      // Open crop modal
      setCropModalImage(previewUrl);
      setOpenImgCrop(true);
    }
  };

  const handleFileRejection = (fileRejection: any) => {
    const rejection = fileRejection[0]?.errors[0];

    setImagePreview(null);
    formik.setFieldTouched("facImageFile", true, false);

    if (rejection?.code === "file-invalid-type") {
      formik.setFieldError("facImageFile", "Image file type not supported.");
    } else if (rejection?.code === "file-too-large") {
      formik.setFieldError("facImageFile", "File size must be under 1 GB.");
    } else {
      formik.setFieldError("facImageFile", "File upload failed.");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[], fileRejection: any) => {
    const handleDrop = async () => {
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        formik.setFieldError("facImageFile", ""); // Clear previous error
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
      "image/jpeg": [".jpeg"],
      "image/jpg": [".jpg"],
      "image/svg+xml": [".svg"],
      "image/heif": [".heif"],
      "image/heic": [".heic"],
    },
    onDrop,
    multiple: false, // Ensures only one file is uploaded
  });

  const handleFormClose = () => {
    formik.resetForm();
    handleCloseAddFacForm();
  };

  const handleOpenImageCrop = () => {
    setOpenImgCrop(true);
    setCropModalImage(formik.values.initialImage);
  };

  const handleCloseImageCrop = () => {
    setOpenImgCrop(false);
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
              Add Facility
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
                      Primary Name
                    </Typography>
                    <TextField
                      placeholder="Primary Name"
                      id="facPrimaryName"
                      name="facPrimaryName"
                      autoComplete="off"
                      value={formik.values.facPrimaryName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                    <Typography variant="caption" fontSize={14}>
                      Speciality
                    </Typography>
                    <Autocomplete
                      multiple
                      id="tags"
                      options={tagsArray.map((option) => option.title)}
                      value={formik.values.facSpeciality}
                      onChange={(_event, value) => {
                        const trimmedValues = value?.map((tag) => tag.trim());
                      
                        // Regex to match only allowed characters: letters, numbers, and spaces
                        const invalidTag = trimmedValues?.find(
                          (tag) => /[^a-zA-Z0-9 ]/.test(tag)
                        );
                      
                        if (invalidTag) {
                          formik.setFieldError(
                            "facSpeciality",
                            "Tags can only contain letters, numbers, and spaces"
                          );
                        } else {
                          // Check for tag exceeding 45 characters
                          const tooLongTag = trimmedValues?.find((tag) => tag?.length > 45);
                          if (tooLongTag) {
                            formik.setFieldError(
                              "facSpeciality",
                              "Tags can’t exceed 45 characters"
                            );
                          } else {
                            const filtered = trimmedValues?.filter((tag) => tag?.length > 1)
                              .filter((tag, index, self) => self.indexOf(tag) === index); // Optional: prevent duplicates
                      
                            formik.setFieldValue("facSpeciality", filtered);
                            formik.setFieldError("facSpeciality", ""); // Clear any previous error
                          }
                        }
                      }}
                      freeSolo
                      limitTags={4}
                      renderTags={() => null}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="filled"
                          placeholder={"Add Tags"}
                          error={
                            formik.touched.facSpeciality &&
                            Boolean(formik.errors.facSpeciality)
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
                          // minWidth: "550px",
                        },
                      }}
                    />
                    {/* Render selected tags below the input field */}
                    {formik.values.facSpeciality.length > 0 && (
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
                        {formik.values.facSpeciality.map(
                          (option: string, index: number) => (
                            <Chip
                              key={`${option}-${index}`}
                              label={option}
                              variant="outlined"
                              onDelete={() => {
                                formik.setFieldValue(
                                  "facSpeciality",
                                  formik.values.facSpeciality.filter(
                                    (tag) => tag !== option
                                  )
                                );
                              }}
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      onBlur={formik.handleBlur}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      placeholder="Type"
                      error={
                        formik.touched.facType && Boolean(formik.errors.facType)
                      }
                      renderValue={(selected: string) => {
                        if (!selected) {
                          return (
                            <span style={{ color: "grey" }}>
                             Type
                            </span>
                          );
                        }
                        return capitalizeWord(selected);
                      }}
                    >
                      {formik.values.facType === "" && (
                        <MenuItem disabled value="" />
                      )}
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
                        fontSize: 12,
                        color:
                          formik.errors.facImageFile ===
                          "Image must be at least 400x400 pixels"
                            ? "red"
                            : "#979DA0",
                      }}
                    >
                      Image must be at least 400x400 pixels
                    </Typography>
                    {formik?.values?.facImageFile && (
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        {formik.errors.facImageFile !=
                          "Image must be at least 400x400 pixels" && (
                          <Box display={"flex"} alignItems={"center"} gap={1}>
                            {imagePreview && (
                              <Box
                                mt={2}
                                display="flex"
                                justifyContent="center"
                              >
                                <Avatar
                                  src={imagePreview}
                                  alt="Uploaded Image"
                                  sx={{
                                    width: 45,
                                    height: 45,
                                  }}
                                />
                              </Box>
                            )}
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
                              {formik.values?.facImageFile?.name}
                            </Typography>
                          </Box>
                        )}
                        {formik.errors.facImageFile !=
                          "Image must be at least 400x400 pixels" && (
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
                    )}
                    {formik.touched.facImageFile &&
                      formik.errors.facImageFile &&
                      formik.errors.facImageFile !=
                        "Image must be at least 400x400 pixels" && (
                        <FormHelperText
                          sx={{ height: "7px", color: "red", mt: "10px" }}
                        >
                          {formik.errors.facImageFile}
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

export default NewAddFacilityForm;
