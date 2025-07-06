import SignedOut from "@/components/SignedOut";
import { VerifyOtpCard } from "@/feature/auth/components/verifyOtpCard";

export default function InputOTPForm() {
 
 

  return (
  <SignedOut>
    <VerifyOtpCard/>
  </SignedOut>
  );
}
