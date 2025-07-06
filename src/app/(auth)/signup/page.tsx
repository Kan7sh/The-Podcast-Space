import SignedOut from "@/components/SignedOut";
import { SignupForm } from "@/feature/auth/components/SignupForm";

export default function SignupPage() {
  return (
    <SignedOut>
      <SignupForm />
    </SignedOut>
  );
}
