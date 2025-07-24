import GlassNavBar from "@/components/Glass-Navbar";
import SignedIn from "@/components/SignedIn";
import { Card } from "@/components/ui/card";
import HomePageButtons from "@/feature/user/components/HomePageButtons";
import HomeMainImg from "@/assets/HomePageImg.png";
import Image from "next/image";
import AboutImg from "@/assets/About.png";
export default function Home() {
  return (
    <SignedIn>
      <div
        style={{
          background:
            "radial-gradient(circle at 50% -90%, #e07404,#e07404, #000000, #000000)",
        }}
        className="home-background grid grid-rows items-center justify-items-center min-h-screen p-8 lg:pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]"
      >
        <GlassNavBar />
        <div className="flex flex-col-reverse lg:flex-row gap-10  lg:gap-10 my-26 lg:my-18 justify-center items-center">
          <Card className="bg-[linear-gradient(to_bottom,_#f5f5f5,_#f5f5f5,_#f5f5f5,_#1b3784)] dark:bg-[linear-gradient(to_bottom,_#171717,_#171717,_#171717,_#1b3784)] border-none rounded-3xl py-10 lg:py-25 px-8">
            <div className="flex flex-col lg:flex-row gap-10">
              <Image src={HomeMainImg}  alt={"HomeImage"} className="lg:w-92 " />
              <div className="flex flex-col gap-8 w-62 lg:w-86">
                <div className="text-xl lg:text-4xl font-bold">
                  Talk, Record, Connect
                  <br /> All in One Space
                </div>
                <div className="text-sm">
                  Welcome to The Podcast Space! Where conversations come alive.
                  Create or join audio rooms to chat in real-time, send instant
                  messages, and record crystal-clear audio without compromise.
                  Our local recording system ensures lossless quality by
                  capturing each voice directly from the source, making it
                  perfect for podcasts, interviews, or just meaningful talk.
                </div>
              </div>
            </div>
          </Card>
          <HomePageButtons />
        </div>
      </div>
      <div id="about" className="lg:h-200 bg-[#1c1c1c] p-10 lg:p-30">
        <div className="flex flex-col items-center gap-10">
          <div className="text-xl lg:text-3xl w-80 lg:w-auto flex  items-center justify-center font-bold border-amber-700 border-2 p-3 rounded-xl bg-black text-white font-schibsted">
            ABOUT THE PODCAST SPACE
          </div>
          <Card className="bg-[linear-gradient(to_bottom,_#171717,_#171717,_#171717,_#e07404)] border-none rounded-3xl py-12 px-8 lg:w-260 lg:h-120">
            <div className="flex flex-col-reverse lg:flex-row gap-12 justify-evenly">
              <div className="flex flex-col gap-8 w-62 lg:w-86 self-center">
                <div className="text-xl lg:text-4xl font-bold text-center">
                  Where Conversations
                  <br /> Turn into Content
                </div>
                <div className="text-sm text-center">
                  The Podcast Space, crafted by Kanish Chhabra, is your hub for
                  meaningful audio experiences — whether you're hosting a
                  podcast, recording an interview, or just chatting with your
                  community. Designed for creators, it offers real-time audio
                  rooms, instant messaging, and high-quality local recordings to
                  ensure your voice is always heard, exactly as it should be.
                  But we're not stopping here. Soon, you'll be able to record
                  and host video podcasts, access advanced editing features, and
                  explore even more tools tailored for modern content creators.
                  This is just the beginning of a powerful space built for your
                  voice.
                </div>
              </div>
              <Image
                src={AboutImg}
                width={400}
                height={400}
                alt={"HomeImage"}
                className="rounded-3xl"
              />
            </div>
          </Card>
          <div>© Kanish Chhabra 2025</div>
        </div>
      </div>
    </SignedIn>
  );
}
