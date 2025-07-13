// page.tsx - Server Component
import { Card } from "@/components/ui/card";
import { getUserRecordings } from "@/feature/user/db/user";
import { AuthOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import DownloadButton from "@/feature/user/components/DownloadButton";

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

    return `${hours}:${minutes} ${day}:${month}:${year}`;
  }

  function formatSeconds(input: number): string {
    const totalSeconds = Math.floor(input);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, "0");

    return `${pad(minutes)}:${pad(seconds)}`;
  }

  return (
    <div className="h-full w-full flex flex-col">
      <div className="text-4xl p-6">Past recordings</div>
      {recordings.map((recording) => (
        <div className="m-3" key={recording.recordingId}>
          <Card className="p-5">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col ">
                <div className="text-xl font-semibold text-white">
                  {recording.roomName}
                </div>
                <div className="text-gray-600">
                  {formatSeconds(Number(recording.duration))}
                </div>
                <div className="text-gray-600">
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
    </div>
  );
}
