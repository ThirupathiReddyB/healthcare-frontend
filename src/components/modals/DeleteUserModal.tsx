import {
  Box,
  Modal,
  Typography,
  TextareaAutosize,
  Button,
} from "@mui/material";
import { useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import { useDeleteUser } from "../../services/steigenApisService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  ButtonModalPrimary,
  ButtonModalSecondary,
  Modalstyle,
} from "../../theme/styles";

type modalProps = {
  open: boolean;
  handleClose: () => void;
  userId: string | undefined;
};

const DeleteUserModal = ({ open, handleClose, userId }: modalProps) => {
  const [reason, setReason] = useState("");
  const { mutate, isPending } = useDeleteUser();
  const navigate = useNavigate();

  const handleDeleteUser = () => {
    // console.log(userId , "delete")
    mutate(
      { userId, reason },
      {
        onSuccess: () => {
          toast.success("User deleted successfully");
          handleClose();
          navigate("/users");
        },
        onError: () => {
          toast.error("Error deleting user");
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
                Delete user
              </Typography>
              <TextareaAutosize
                placeholder="Type reason…"
                minRows={10}
                style={{ border: "none", width: "350px" }}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Box>
            <Box display="flex" justifyContent={"center"} gap="16px" mt={4}>
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
                onClick={handleDeleteUser}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default DeleteUserModal;
