import { useUserStore } from "@/store/zustand/UserStore";
import { User } from "@/store/zustand/User";

export const useUser = () => {
  const {
    user,
    isAuthenticated,
    setUser,
    updateUser,
    clearUser,
    getUserId,
    getUserName,
    getUserEmail,
    getUserImage,
  } = useUserStore();

  return {
    // State
    user,
    isAuthenticated,
    userId: getUserId(),
    userName: getUserName(),
    userEmail: getUserEmail(),
    userImage: getUserImage(),

    // Actions
    setUser,
    updateUser,
    clearUser,
  };
};
