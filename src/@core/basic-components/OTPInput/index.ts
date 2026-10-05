export { default } from "./OTPInput";

export interface OTPInputProps {
  length: number;
  onComplete: (otp: string | null) => void;
  reset?: any;
}
