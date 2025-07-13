import SignedOut from "@/components/SignedOut";
import { VerifyOtpCard } from "@/feature/auth/components/VerifyOtpCard";
import styles from "../../../styles/SignupPage.module.css";

export default function InputOTPForm() {
  return (
    <SignedOut>
      <div className={styles.container}>
        <VerifyOtpCard />
      </div>
    </SignedOut>
  );
}
