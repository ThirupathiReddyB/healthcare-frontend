import { Box, Typography, CircularProgress } from "@mui/material";
import { MdOutlineUploadFile } from "react-icons/md";

interface UploadComponent {
  isImageLoading: boolean;
  previewUrl: string | null;
  advDataLink?: string;
}
const LoadingState = () => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
  >
    <Box width="30px" justifyContent="center">
      <CircularProgress size="25px" sx={{ color: "orange" }} />
    </Box>
    <Typography fontSize={14} fontWeight={500} color="#979DA0" align="center">
      Uploading ...
    </Typography>
  </Box>
);

const PreviewState = ({
  previewUrl,
  advDataLink,
}: {
  previewUrl?: string | null;
  advDataLink?: string;
}) => (
  <>
    <img
      src={previewUrl ?? advDataLink}
      alt="Uploaded"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
      }}
    />
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="absolute"
      width="100%"
      height="100%"
      bgcolor="rgba(0, 0, 0, 0.3)"
      color="white"
      zIndex={2}
    >
      <Box width="46px">
        <MdOutlineUploadFile color="white" size={40} />
      </Box>
      <Typography fontSize={14} fontWeight={600}>
        Drag and drop or browse images.
      </Typography>
    </Box>
  </>
);

const DefaultState = () => (
  <Box display="flex" flexDirection="column" alignItems="center">
    <Box width="46px">
      <MdOutlineUploadFile color="#FFB374" size={40} />
    </Box>
    <Typography fontSize={14} fontWeight={500} color="#979DA0">
      Drag and drop or browse images.
    </Typography>
  </Box>
);


const UploadComponent = ({
  isImageLoading,
  previewUrl,
  advDataLink,
}: UploadComponent) => {

  if (isImageLoading) {
    return <LoadingState />;
  }

  if (previewUrl || advDataLink) {
    return <PreviewState previewUrl={previewUrl} advDataLink={advDataLink} />;
  } else {
    return <DefaultState />;
  }
};

export default UploadComponent;
