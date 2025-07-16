// page.tsx - Server Component
import { Card } from "@/components/ui/card";
import { getUserRecordings } from "@/feature/user/db/user";
import { AuthOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import DownloadButton from "@/feature/user/components/DownloadButton";
import { ScrollArea } from "@/components/ui/scroll-area";

export default async function PastRecordingsPage() {
  const session = await getServerSession(AuthOptions);

  if (!session?.user?.id) {
    return <div>Please log in to view recordings</div>;
  }

  const recordings = await getUserRecordings(Number(session.user.id));
  function formatDateTime(input: string): string {
    if (input === "") return "";

    const date = new Date(input);

    const pad = (n: number) => n.toString().padStart(2, "0");

    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const day = pad(date.getDate());
    const month = pad(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  }

  function formatSeconds(input: number): string {
    const totalSeconds = Math.floor(input);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${pad(minutes)}:${pad(seconds)}`;
  }

  return (
    <div
      className="h-screen w-screen flex flex-col p-10 bg-[#1c1c1c] justify-center items-center"
      style={{
        background:
          "radial-gradient(circle at 50% -90%, #1b3784,#1b3784, #000000, #000000)",
      }}
    >
      <div className="text-3xl font-bold border-amber-700 border-2 py-4  px-14 mb-5 rounded-xl bg-black text-white font-schibsted">
        PAST RECORDINGS
      </div>
      <ScrollArea className="h-[650px] p-6 bg-black rounded-3xl overflow-y-hidden ">
        {recordings.map((recording) => (
          <div
            className="m-3 lg:w-190  overflow-y-hidden"
            key={recording.recordingId}
          >
            <Card className="p-5 bg-[linear-gradient(to_bottom,_#1f1f1f,_#1f1f1f,_#1f1f1f,_#262626)] border-none rounded-2xl">
              <div className="flex flex-row justify-between items-center">
                <div className="flex flex-col ">
                  <div className="text-xl font-semibold text-white">
                    {recording.roomName}
                  </div>
                  <div className="text-gray-500">
                    {formatSeconds(Number(recording.duration))}
                  </div>
                  <div className="text-gray-300">
                    {formatDateTime(recording.createdAt?.toISOString() ?? "")}
                  </div>
                </div>
                <div>
                  <DownloadButton url={recording.recordingUrl ?? ""} />
                </div>
              </div>
            </Card>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
