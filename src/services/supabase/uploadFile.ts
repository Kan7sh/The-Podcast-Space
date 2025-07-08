import { supabase } from "./client";

export async function uploadFileToSupabase(file: File) {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `avatar_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });
    if (error) {
      throw error;
    }

    const { data: publicData } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    return publicData.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}
