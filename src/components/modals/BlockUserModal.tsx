import { Box, Modal, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import { useBlockUser } from "../../services/steigenApisService";
import { toast } from "react-toastify";
import {
  ButtonModalPrimary,
  ButtonModalSecondary,
  Modalstyle,
} from "../../theme/styles";
import { AxiosError } from "axios";

const BlockUserModal = ({
  open,
  handleClose,
  userId,
}: {
  open: boolean;
  handleClose: () => void;
  userId: string | undefined;
}) => {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = useBlockUser();

  useEffect(() => {
    if (open) {
      setReason("");
      setError("");
    }
  }, [open]);
  
  const handleBlockUser = () => {

    if (reason.trim().length < 1) {
      setError("Please specify the reason.");
      return;
    } else if (reason.length > 1000) {
      setError("Reason can be at most 1000 characters long.");
      return;
    }

    setError("");
    mutate(
      { userId, reason },
      {
        onSuccess: () => {
          toast.success("User blocked successfully");
          handleClose();
        },
        onError: (err: AxiosError) => {
          if (err?.response?.status === 400) {
            toast.error("Please provide a reason for blocking the user.");
          } else if (err?.response?.status === 404) {
            toast.error("User you are trying to block does not exist.");
          } else {
            toast.error("Error occured while blocking the user");
          }
        },
      }
    );
  };

  return (
    <Box>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ ...Modalstyle, width: "400" }}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Box display={"flex"} justifyContent={"flex-end"} mt={2}>
              <RiCloseLargeLine
                onClick={handleClose}
                style={{ cursor: "pointer" }}
              />
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              my={"5px"}
            >
              <Typography my={3} fontWeight={600} fontSize={24}>
                Block user
              </Typography>
              <textarea
                placeholder="Type reason…"
                style={{
                  border: "1px solid #ccc", // Light grey border for non-focused state
                  borderRadius: "4px", // Optional: Adds rounded corners
                  maxWidth: "350px",
                  minWidth: "350px",
                  maxHeight: "400px",
                  overflow: "auto",
                  resize: "none",
                  lineHeight: "1.5",
                  height: "auto",
                  minHeight: "3em", // Approximate height for 2 rows of text
                  padding: "8px", // Optional: Adds padding inside the textarea
                  boxSizing: "border-box", // Ensures padding and border are included in the to
                }}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={10} // Maximum number of rows
              />
               {error && (
                <Typography color="error" fontSize={12} mt={1}>
                  {error}
                </Typography>
              )}
            </Box>
            <Box display="flex" justifyContent={"center"} gap="16px" my={4}>
              <Button
                variant="outlined"
                type="button"
                onClick={handleClose}
                sx={ButtonModalSecondary}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                disabled={isPending}
                sx={ButtonModalPrimary}
                onClick={handleBlockUser}
              >
                Block
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default BlockUserModal;
