import { Box, Button } from "@mui/material";

export default function SaveCancelGroupBtn({
  onCancel,
  pending,
} : Readonly<{
  onCancel: () => void;
  pending: boolean;
}>) {
  return (
    <Box display="flex" justifyContent={"flex-end"} gap="16px" my="20px">
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
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button
        variant="contained"
        type="submit"
        disabled={pending}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          background:
            "linear-gradient(90deg,rgba(255, 102, 0, 0.9), rgba(255, 102, 0, 0.6))",
        }}
      >
        Save
      </Button>
    </Box>
  );
}
