import SignedOut from "@/components/SignedOut";
import { LoginFrom } from "@/feature/auth/components/LoginFrom";
import styles from "../../styles/loginpage.module.css";
import { Card } from "@/components/ui/card";
import LoginImage from "@/assets/LoginImage.jpg";
import LogoImage from "@/assets/logo.png";
import Image from "next/image";
import RotatingText from "./_RotatingText";
export default function LoginPage() {
  return (
    <SignedOut>
      <div className={styles.container}>
        <Card className="h-150 rounded-4xl shadow-2xl border-none flex-5 p-8 bg-[linear-gradient(to_bottom,_#171717,_#171717,_#171717,_#2a0357)] flex flex-row">
          <Image
            src={LoginImage}
            alt="Login Image"
            width={450}
            height={600}
            className="rounded-3xl"
          />
          <div className="flex flex-col justify-center">
            <div className="flex flex-row justify-center items-center">
              <Image src={LogoImage} alt="Logo Image" width={95} height={95} />
              <div className="text-3xl font-bold border-amber-700 border-2 p-3 rounded-xl bg-black text-white font-schibsted">
                THE PODCAST SPACE
              </div>
            </div>
            <div className="text-center text-sm">
              The Podcast Space lets you create and join live audio rooms to
              chat, collaborate, and record podcasts with others. Each speaker’s
              voice is locally recorded for the highest quality, then synced
              seamlessly. Start conversations that sound as good as they feel.
            </div>
            <RotatingText />
          </div>
        </Card>
        <div className="flex-2 h-150 w-full rounded-4xl">
          <LoginFrom />
        </div>
      </div>
    </SignedOut>
  );
}
