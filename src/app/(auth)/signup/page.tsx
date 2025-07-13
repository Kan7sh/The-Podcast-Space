import SignedOut from "@/components/SignedOut";
import { SignupForm } from "@/feature/auth/components/SignupForm";
import styles from "../../styles/SignupPage.module.css";

export default function SignupPage() {
  return (
    <SignedOut>
      <div className={styles.container}>
        <SignupForm />
      </div>
    </SignedOut>
  );
}
