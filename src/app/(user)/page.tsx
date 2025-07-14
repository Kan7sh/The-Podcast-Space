import GlassNavBar from "@/components/Glass-Navbar";
import SignedIn from "@/components/SignedIn";
import HomePageButtons from "@/feature/user/components/HomePageButtons";
export default function Home() {
  return (
    <SignedIn>
      <div className="bg-[linear-gradient(to_bottom,_#000000,_#000000,_#000000,_#000000)] grid grid-rows items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <GlassNavBar />
        <HomePageButtons />
      </div>
      <div className="h-140">About</div>
    </SignedIn>
  );
}
