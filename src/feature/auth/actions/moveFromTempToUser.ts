import { getTempUserById, insertUser } from "../db/auth";

export async function moveFromTempToUser(id: number) {
  const tempUser = await getTempUserById(id);
  if (tempUser != null) {
    await insertUser({
      name: tempUser.name,
      email: tempUser.email,
      password: tempUser.password,
      createdAt: new Date(),
      updatedAt: new Date(),
      authType: "credentials",
    });
    return true;
  } else {
    return false;
  }
}
