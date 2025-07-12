import { getRecordingIdFromRoomId, insertUserRecordingData } from "../db/room";

export async function createJoinUserRecordings(userId: number, roomId: number) {
  const recording = await getRecordingIdFromRoomId(roomId);
  if (recording != null) {
    await insertUserRecordingData({
      recordingId: recording.id,
      userId: userId,
      roomId: roomId,
      createdAt: new Date(),
    });
    return true;
  }
  return false;
}
