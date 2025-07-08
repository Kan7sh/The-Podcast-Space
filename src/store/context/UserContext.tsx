"use client";

import { createContext, useContext, useState } from "react";

type UserContextType = {
  id: number;
  name: string;
  email: string;
  imageUrl: string;
  setId: (val: number) => void;
  setName: (val: string) => void;
  setEmail: (val: string) => void;
  setImageUrl: (val: string) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const RoomProvider = ({ children }: { children: React.ReactNode }) => {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <UserContext.Provider
      value={{
        id,
        name,
        email,
        imageUrl,
        setId,
        setName,
        setEmail,
        setImageUrl,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserHook = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }
  return context;
};
