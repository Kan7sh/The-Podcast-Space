"use client";

import { createContext, useContext, useState } from "react";

type RoomContextType = {
  isRoomCreating: boolean;
  roomName: string;
  numberOfParticipants: number;
  setIsRoomCreating: (val: boolean) => void;
  setRoomName: (val: string) => void;
  setNumberOfParticipants: (val: number) => void;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [isRoomCreating, setIsRoomCreating] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [numberOfParticipants, setNumberOfParticipants] = useState(8);

  return (
    <RoomContext.Provider
      value={{
        isRoomCreating,
        roomName,
        numberOfParticipants,
        setIsRoomCreating,
        setRoomName,
        setNumberOfParticipants,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
