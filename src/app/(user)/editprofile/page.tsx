"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { uploadFileToSupabase } from "@/services/supabase/uploadFile";
import { getSession, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Edit3 } from "lucide-react";
import { updateUser } from "@/feature/user/db/user";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const router = useRouter();
  const { data: session, update } = useSession();

  const form = useForm({
    defaultValues: {
      file: null,
      imageUrl: session?.user.image,
      name: session?.user.name,
      email: session?.user.email,
    },
  });

  const watchedValues = form.watch();

  // Check for changes whenever form values change
  useEffect(() => {
    const currentName = watchedValues.name;
    const currentFile = watchedValues.file;
    const originalName = session?.user.name;

    const nameChanged = currentName !== originalName;
    const imageChanged = currentFile !== null || previewUrl !== "";

    setHasChanges(nameChanged || imageChanged);
  }, [watchedValues, session?.user.name, previewUrl]);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      form.setValue("file", file);
    }
  };

  const updateUserData = async () => {
    const file = form.getValues("file");
    const name = form.getValues("name");

    let url = session?.user.image;

    setUploading(true);

    if (file) {
      url = await uploadFileToSupabase(file);
    }
    await updateUser(session?.user.id ?? "", {
      name: name,
      email: session?.user.email,
      imageUrl: url,
      updatedAt: new Date(),
    });

    const newSession = await update({
      ...session?.user,
      name: name,
      image: url,
    });

    console.log(newSession);

    router.push("/");

    setUploading(false);

    try {
      console.log("Upload successful:", url);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center gap-4">
      <Card className="p-6 flex flex-col items-center gap-4">
        {/* Avatar with edit icon */}
        <div className="relative">
          <Avatar className="w-32 h-32">
            <AvatarImage
              src={avatarUrl || previewUrl || session?.user.image || undefined}
              alt="Avatar preview"
            />
            <AvatarFallback>
              {session?.user.name
                ? session.user.name
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase())
                    .join("")
                    .slice(0, 2)
                : "U"}
            </AvatarFallback>
          </Avatar>

          {/* Edit icon positioned above and to the left of avatar */}
          <label
            htmlFor="file-input"
            className="absolute -top-2 -left-2 bg-primary text-primary-foreground rounded-full p-1.5 cursor-pointer hover:bg-primary/90 transition-colors shadow-lg"
          >
            <Edit3 size={16} />
          </label>

          {/* Hidden file input */}
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <Form {...form}>
          <form className="space-y-4 w-full max-w-sm">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </Card>

      <Button
        onClick={updateUserData}
        disabled={uploading || !hasChanges}
        className="min-w-32"
      >
        {uploading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
