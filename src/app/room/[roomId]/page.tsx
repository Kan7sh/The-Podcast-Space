import RoomUI from "@/feature/room/components/RoomUI";

interface LocationState {
  isCreating?: boolean;
}

const iceServers = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
  { urls: "stun:stun2.l.google.com:19302" },
  { urls: "stun:stun3.l.google.com:19302" },
  { urls: "stun:stun4.l.google.com:19302" },
  {
    urls: "turn:numb.viagenie.ca",
    credential: "muazkh",
    username: "webrtc@live.com",
  },
  {
    urls: "turn:turn.anyfirewall.com:443?transport=tcp",
    credential: "webrtc",
    username: "webrtc",
  },
];

export default async function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;
  return (
    <div>
      <RoomUI roomId={roomId} />
    </div>
  );
}
