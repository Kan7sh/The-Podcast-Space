import { getUserByEmail } from "@/feature/auth/db/auth";
import { insertRoomData, insertUserRecordingData } from "../db/room";
import { insertRecordingsData } from "@/feature/recordings/db/recordings";

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
    const roomNumberId = await insertRoomData({
      name: roomName,
      hostId: user.id,
      numberOfAllowedParticipants: numberOfParticipants,
      roomId: roomId,
      createdAt: new Date(),
      isActive: true,
    });

    const recordingId = await insertRecordingsData({
      roomId: roomNumberId[0].id,
      createdAt: new Date(),
    });

    if (recordingId != null) {
      await insertUserRecordingData({
        roomId: roomNumberId[0].id,
        userId: user.id,
        recordingId: recordingId[0].id,
        createdAt: new Date(),
      });
    }

    return roomId;
  } else {
    return null;
  }
}
