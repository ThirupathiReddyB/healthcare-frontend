export const Modalstyle = {
  // eslint-disable-next-line @typescript-eslint/prefer-as-const
  position: "absolute" ,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: "24px",
  p: 4,
};

export const ButtonModalSecondary = {
  borderRadius: "20px",
  textTransform: "none",
  color: "gray",
  borderColor: "gray",
  "&:hover": {
    backgroundColor: "white",
    color: "orange",
    borderColor: "orange",
  },
};

export const ButtonModalPrimary = {
  borderRadius: "20px",
  textTransform: "none",
  background:
    "linear-gradient(90deg,rgba(255, 102, 0, 0.9), rgba(255, 102, 0, 0.6))",
};
