"use client";

import SignedIn from "@/components/SignedIn";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createRoom } from "@/feature/room/actions/createRoom";
import { cn } from "@/lib/utils";
import { useRoom } from "@/store/context/RoomContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, Check } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export default function Home() {
  const { setIsRoomCreating, setNumberOfParticipants, setRoomName } = useRoom();
  const router = useRouter();
  const session = useSession();

  const handleCreateRoom = async (data: any) => {
    let roomId = null;

    if (session.data != null) {
      roomId = await createRoom({
        roomName: data.roomName,
        numberOfParticipants: Number(data.numberOfParticipants),
        hostEmail: session.data.user.email,
      });
      setIsRoomCreating(true);
      setRoomName(data.roomName);
      setNumberOfParticipants(data.numberOfParticipants);
      router.push(`/room/${roomId}`);
    } else {
      toast("There was some error creating the room");
    }
  };

  async function logout() {
    await signOut();
  }

  const roomParticipantsNumber = [
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
  ] as const;

  const FormSchema = z.object({
    roomName: z.string({ required_error: "Please enter the room name" }),
    numberOfParticipants: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      numberOfParticipants: "5",
      roomName: "",
    },
  });

  const joinRoomForm = useForm({
    defaultValues: {
      roomId: "",
    },
  });
  const joinRoom = (data: any) => {
    setIsRoomCreating(false);
    setRoomName(data.roomId);
    router.push(`/room/${data.roomId}`);
  };

  return (
    <SignedIn>
      <div className="grid grid-rows items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Button onClick={logout}>Logout</Button>
        <Button asChild>
          <Link href={"/editprofile"}>Edit Profile</Link>
        </Button>
        <Button>About</Button>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create a room</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create a room</DialogTitle>
              <DialogDescription>
                Enter the room name and number of Participants
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCreateRoom)}
                  className="space-y-6"
                >
                  <FormField
                    name="roomName"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Name</FormLabel>

                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="numberOfParticipants"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Room Participants</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "w-[200px] justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? roomParticipantsNumber.find(
                                      (numberOfParticipants) =>
                                        numberOfParticipants.value ===
                                        field.value
                                    )?.label
                                  : "Select participants..."}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandList>
                                <CommandGroup>
                                  {roomParticipantsNumber.map((participant) => (
                                    <CommandItem
                                      value={participant.label}
                                      key={participant.value}
                                      onSelect={() => {
                                        form.setValue(
                                          "numberOfParticipants",
                                          participant.value
                                        );
                                      }}
                                    >
                                      {participant.label}
                                      <Check
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          participant.value === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Select the number of participants for the room.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">Create</Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button>Join a Room</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Join room</DialogTitle>

              <DialogDescription>Enter the room Id to join</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3"></div>
              <Form {...joinRoomForm}>
                <form
                  onSubmit={joinRoomForm.handleSubmit(joinRoom)}
                  className="space-y-6"
                >
                  <FormField
                    name="roomId"
                    control={joinRoomForm.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Room Id</FormLabel>

                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Join</Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
        <Button>Past recordings</Button>
      </div>
    </SignedIn>
  );
}
