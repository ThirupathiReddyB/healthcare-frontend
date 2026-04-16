import React, {
  useState,
  useRef,
  ClipboardEvent,
  KeyboardEvent,
  ChangeEvent,
} from "react";
import { Box, TextField } from "@mui/material";

interface OTPInputProps {
  length: number;
  onChange: (otp: string) => void;
  onKeyPress :(e:React.KeyboardEvent<Element>) => void;
}

const OtpInput: React.FC<OTPInputProps> = ({ length, onChange, onKeyPress }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/\D/g, "");

    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value[0];
      setOtp(newOtp);
      onChange(newOtp.join(""));

      if (index < length - 1) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    const paste = e.clipboardData.getData("text");
    const newOtp = paste.split("").slice(0, length);
    setOtp(newOtp);
    onChange(newOtp.join(""));

    newOtp.forEach((_, index) => {
      if (inputs.current[index]) {
        inputs.current[index].value = newOtp[index];

      }
    });

    if (newOtp.length < length) {
      inputs.current[newOtp.length]?.focus();
    }
  };


  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        // Clear current input field if it's not empty
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange(newOtp.join(""));
      } else if (index > 0) {
        // Move focus to the previous input field
        inputs.current[index - 1]?.focus();
  
        // Clear the previous input field
        const newOtp = [...otp];
        newOtp[index - 1] = ""; 
        setOtp(newOtp);
        onChange(newOtp.join(""));
      }
    } else if (e.key === "Enter") {
      onKeyPress(e);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: 2,
        padding: "5px",
        border: "1px solid orange",
        borderRadius: "15px",
        width: "fit-content",
        margin: "0 auto",
      }}
    >
      {otp.map((_, index) => (
        <TextField
          key={`${index}`}
          inputRef={(el) => (inputs.current[index] = el)}
          value={otp[index]}
          autoComplete="one-time-code"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(e.target as HTMLInputElement, index)
          }
          onKeyDown={(e: KeyboardEvent) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: "center",
              fontSize: "2rem", 
            },
            placeholder: "•", 
            sx: {
              "&::placeholder": {
                fontSize: "50px", 
                color: "gray", 
                fontWeight: "bold",
              },
            },
          }}
          sx={{
            width: "60px",
            height: "40px",
            margin: "0 5px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "50%",
              borderWidth: "1px",
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "transparent",
              },
              "& fieldset": {
                borderColor: "transparent",
              },
            },
            "& .MuiInputBase-input": {
              padding: 0,
            },
          }}
          variant="outlined"
        />
      ))}
    </Box>
  );
};

export default OtpInput;
