import SignedIn from "@/components/SignedIn";
import HomePageButtons from "@/feature/user/components/HomePageButtons";
export default function Home() {
  return (
    <SignedIn>
      <div className="grid grid-rows items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <HomePageButtons />
      </div>
    </SignedIn>
  );
}
