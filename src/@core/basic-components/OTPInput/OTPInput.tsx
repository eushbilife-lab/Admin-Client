import { Box, TextField } from "@mui/material";
import { ChangeEvent, KeyboardEvent, ClipboardEvent, useEffect, useState } from "react";
import { OTPInputProps } from ".";

export default function OTPInput({ reset, length, onComplete }: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));

  useEffect(() => {
    setOtp(Array(length).fill(""));
  }, [reset, length]);

  const commit = (next: string[]) => {
    setOtp(next);
    const joined = next.join("");
    onComplete(joined.length === length ? joined : null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = value;
    commit(next);
    if (value && index < length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLDivElement>) => {
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pastedData) return;
    e.preventDefault();
    const next = pastedData.split("").slice(0, length);
    while (next.length < length) next.push("");
    commit(next);
    document.getElementById(`otp-input-${Math.min(pastedData.length, length) - 1}`)?.focus();
  };

  return (
    <Box className="login-otp" display="flex" justifyContent="center" gap={1} width="100%">
      {Array.from({ length }).map((_, index) => (
        <TextField
          key={index}
          id={`otp-input-${index}`}
          value={otp[index]}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          inputProps={{ maxLength: 1, inputMode: "numeric", autoComplete: "one-time-code" }}
          variant="outlined"
          sx={{
            width: 56,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              background: "var(--color-paper)",
              height: 64,
            },
            "& .MuiOutlinedInput-input": {
              textAlign: "center",
              fontFamily: "var(--font-display)",
              fontSize: "1.45rem",
              fontWeight: 600,
              padding: 0,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--border-color)",
            },
            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--color-science)",
            },
          }}
        />
      ))}
    </Box>
  );
}
