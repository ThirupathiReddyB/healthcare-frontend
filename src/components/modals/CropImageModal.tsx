import { useState, useRef, useEffect } from "react";
import { Box, Modal, Typography, Button } from "@mui/material";
import { RiCloseLargeLine } from "react-icons/ri";
import ReactCrop, {
  centerCrop,
  Crop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type ModalProps = {
  openImgCrop: boolean;
  handleCloseImgCrop: () => void;
  uploadedImage: string | null;
  onCropComplete: (file: File) => void;
};

const ASPECT_RATIO = 1;

const CropImageModal = ({
  openImgCrop,
  handleCloseImgCrop,
  uploadedImage,
  onCropComplete,
}: ModalProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    width: 400,
    height: 400,
    x: 0,
    y: 0
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  
  useEffect(() => {
    if (uploadedImage) {
      setCrop({ unit: "%", width: 400, height: 400, x: 0, y: 0 });
    }
  }, [uploadedImage]);

  const handleSave = async () => {
    if (!completedCrop || !imgRef.current || !uploadedImage) return;

    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Create an off-screen canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Convert canvas to Blob and then to File
    canvas.toBlob((blob) => {
      if (blob) {
        const originalFileName =
          uploadedImage.split("/").pop() ?? "cropped-image.jpg";
        const file = new File([blob], originalFileName, { type: "image/jpeg" });

        onCropComplete(file); // Pass the cropped file
      }
    }, "image/jpeg");

    handleCloseImgCrop();
  };

  const onImageLoad = (e: any) => {
    const { width, height } = e.currentTarget;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: 70,
        height: 70,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
    setCompletedCrop({
      unit: "px",
      x: (centeredCrop.x / 100) * width,
      y: (centeredCrop.y / 100) * height,
      width: (centeredCrop.width / 100) * width,
      height: (centeredCrop.height / 100) * height,
    });
    
  };

  return (
    <Modal open={openImgCrop} aria-labelledby="modal-title">
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 690,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "24px",
          p: 3,
        }}
      >
        <Box
          sx={{
            maxHeight: "80vh",
            overflow: "auto",
            scrollbarWidth: "thin",
            "&::-webkit-scrollbar": { width: "5px" },
          }}
        >
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography id="modal-title" fontWeight={600} fontSize={20}>
              Crop Uploaded Image
            </Typography>
            <RiCloseLargeLine
              style={{ cursor: "pointer" }}
              onClick={handleCloseImgCrop}
            />
          </Box>

          {/* Image Cropper */}
          {uploadedImage && (
            <Box
              mt={2}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Typography fontWeight={600} fontSize={15} my={1}>
                Move the rectangle below to crop and save image
              </Typography>

              <ReactCrop
                crop={crop}
                onChange={(percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={ASPECT_RATIO}
                minHeight={150}
                // maxHeight={480}
                style={{ 
                  maxHeight: "428px",
                  maxWidth:"100%",
                  }}
              >
                <Box
                  style={{
                    // width: "610px",
                    height: "430px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // overflow: "hidden",
                  }}
                >
                  <img
                    ref={imgRef}
                    src={uploadedImage}
                    alt="Crop"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                    onLoad={onImageLoad}
                  />
                </Box>
              </ReactCrop>

              {/* Buttons */}
              {
                <Box
                  display="flex"
                  justifyContent={"flex-end"}
                  gap="16px"
                  my="20px"
                >
                  <Button
                    variant="outlined"
                    type="button"
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
                    onClick={handleCloseImgCrop}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    type="submit"
                    onClick={handleSave}
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      background:
                        "linear-gradient(90deg,rgba(255, 102, 0, 0.9), rgba(255, 102, 0, 0.6))",
                    }}
                  >
                    Save Image
                  </Button>
                </Box>
              }
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default CropImageModal;
