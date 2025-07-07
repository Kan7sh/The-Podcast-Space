import SignedOut from "@/components/SignedOut";
import { VerifyOtpCard } from "@/feature/auth/components/VerifyOtpCard";

export default function InputOTPForm() {
  return (
    <SignedOut>
      <VerifyOtpCard />
    </SignedOut>
  );
}
