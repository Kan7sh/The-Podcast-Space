import SignedOut from "@/components/SignedOut";
import { LoginFrom } from "@/feature/auth/components/LoginFrom";
import { Card } from "@/components/ui/card";
import LoginImage from "@/assets/LoginImage.jpg";
import LogoImage from "@/assets/logo.png";
import Image from "next/image";
import RotatingText from "./_RotatingText";

export default function LoginPage() {
  return (
    <SignedOut>
      <div className="min-h-screen flex flex-col-reverse lg:flex-row gap-4 p-4 lg:p-8 mt-10 mb-10 lg:mb-0">
        <Card className="h-auto lg:h-[37.5rem] rounded-4xl shadow-2xl border-none flex-1 lg:flex-[5] p-4 lg:p-8 bg-gradient-to-b from-neutral-900 via-neutral-900 to-blue-900 flex flex-col lg:flex-row">
          <div className="flex justify-center lg:justify-start mb-6 lg:mb-0">
            <Image
              src={LoginImage}
              alt="Login Image"
              className="rounded-3xl w-full max-w-sm max-h-110  lg:max-w-none lg:max-h-none lg:w-auto lg:h-auto object-fill"
            />
          </div>
          <div className="flex flex-col justify-center lg:ml-8 text-center lg:text-left">
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center mb-4 gap-2">
              <Image
                src={LogoImage}
                alt="Logo Image"
                className="w-16 h-16 sm:w-24 sm:h-24 lg:w-24 lg:h-24 "
              />
              <div className="text-xl  lg:text-3xl font-bold border-amber-700 border-2 p-2 lg:p-3 rounded-xl bg-black text-white font-schibsted">
                THE PODCAST SPACE
              </div>
            </div>
            <div className="text-center lg:text-left text-xs sm:text-sm lg:text-base mb-4 text-gray-300 px-2 lg:px-0">
              The Podcast Space lets you create and join live audio rooms to
              chat, collaborate, and record podcasts with others. Each speaker's
              voice is locally recorded for the highest quality, then synced
              seamlessly. Start conversations that sound as good as they feel.
            </div>

            <RotatingText />
          </div>
        </Card>

        <div className="flex-1 lg:flex-[2] h-auto lg:h-[37.5rem] w-full">
          <LoginFrom />
        </div>
      </div>
    </SignedOut>
  );
}
