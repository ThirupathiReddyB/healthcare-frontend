import { Avatar, Box, Button, Modal, Typography } from "@mui/material";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Modalstyle } from "../../theme/styles";

const DeleteModal = ({
  open,
  handleClose,
  handleDelete,
}: {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
}) => {
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
            <Box
              display={"flex"}
              alignItems={"center"}
              flexDirection={"column"}
            >
              <Avatar sx={{ bgcolor: "#fff8f0", width: 56, height: 56 }}>
                <RiDeleteBin6Line color="#EF7612" size={30} />
              </Avatar>
              <Typography my={3} fontWeight={600} fontSize={24}>
                Want to Delete
              </Typography>
            </Box>
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              my={"5px"}
            >
              <Typography fontSize={14}>
                Are you sure you want to delete this video?
              </Typography>
              <Typography fontSize={14}>
                You will{" "}
                <span style={{ color: "#EF7612" }}>
                  not be able to recover them.
                </span>{" "}
              </Typography>
            </Box>
            <Box display="flex" justifyContent={"center"} gap="16px" mt={4}>
              <Button
                variant="outlined"
                type="button"
                onClick={handleClose}
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
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                type="submit"
                onClick={handleDelete}
                sx={{
                  borderRadius: "20px",
                  textTransform: "none",
                  background:
                    "linear-gradient(90deg,rgba(255, 102, 0, 0.9), rgba(255, 102, 0, 0.6))",
                }}
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

export default DeleteModal;
