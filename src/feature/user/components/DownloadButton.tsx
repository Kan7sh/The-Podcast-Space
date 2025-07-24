"use client";
import { Button } from "@/components/ui/button";

export default function DownloadButton({
  url,
  filename = "recording.mp3", // fallback filename
}: {
  url: string;
  filename?: string;
}) {
  const handleDownload = async () => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return <Button onClick={handleDownload} className="bg-amber-600 text-white py-5 rounded-xl text-xs lg:text-sm">Download Recording</Button>;
}
