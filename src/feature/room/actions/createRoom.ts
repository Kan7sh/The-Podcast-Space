import { getUserByEmail } from "@/feature/auth/db/auth";
import { insertRoomData } from "../db/room";

export async function createRoom({
  roomName,
  hostEmail,
  numberOfParticipants,
}: {
  roomName: string;
  hostEmail: string;
  numberOfParticipants: number;
}) {
  const roomId = Math.random().toString(36).substring(2, 8);
  const user = await getUserByEmail(hostEmail);

  if (user != null) {
    await insertRoomData({
      name: roomName,
      hostId: user.id,
      numberOfAllowedParticipants: numberOfParticipants,
      roomId: roomId,
      createdAt: new Date(),
    });
    return roomId;
  } else {
    return null;
  }
}
