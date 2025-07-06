import SignedOut from "@/components/SignedOut";
import { LoginFrom } from "@/feature/auth/components/LoginFrom";

export default function LoginPage() {
  return (
    <SignedOut>
      <LoginFrom />
    </SignedOut>
  );
}
