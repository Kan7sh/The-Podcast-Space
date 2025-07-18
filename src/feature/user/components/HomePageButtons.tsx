"use client";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { LoadingSwap } from "@/components/LoadingSwap";
import { cn } from "@/lib/utils";
import {
  ChevronsUpDown,
  Check,
  List,
  LogIn,
  AlignCenterHorizontal,
} from "lucide-react";
import Link from "next/link";
import { createJoinUserRecordings } from "@/feature/room/actions/createJoinUserRecordings";
import { createRoom } from "@/feature/room/actions/createRoom";
import { findActiveRoom } from "@/feature/room/db/room";
import { useRoom } from "@/store/context/RoomContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Card } from "@/components/ui/card";

export default function HomePageButtons() {
  const { setIsRoomCreating, setNumberOfParticipants, setRoomName } = useRoom();
  const router = useRouter();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);

  if (session.status === "loading") {
    return (
      <div className="h-screen w-screen flex items-center justify-center self-center">
        <LoadingSpinner />
      </div>
    );
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

  const handleCreateRoom = async (data: any) => {
    setIsLoading(true);
    let roomId = null;
    if (session.data?.user?.email) {
      roomId = await createRoom({
        roomName: data.roomName,
        numberOfParticipants: Number(data.numberOfParticipants),
        hostEmail: session.data.user.email,
      });
      setIsRoomCreating(true);
      setRoomName(data.roomName);
      setNumberOfParticipants(data.numberOfParticipants);
      setIsLoading(false);

      router.push(`/room/${roomId}`);
    } else {
      toast("There was some error creating the room");
      setIsLoading(false);
      return;
    }
  };

  const joinRoom = async (data: any) => {
    setIsLoading(true);

    if (!session.data?.user?.id) {
      toast.error("User not authenticated");
      setIsLoading(false);
      return;
    }

    const room = await findActiveRoom(data.roomId);
    if (
      (room?.currentParticiants ?? 0) >=
      (room?.numberOfAllowedParticipants ?? 0)
    ) {
      setIsLoading(false);
      toast.error("Room is Full");
      return;
    }

    const createUserRecording = await createJoinUserRecordings(
      Number(session.data.user.id),
      room?.id ?? 0
    );
    setIsLoading(false);

    if (createUserRecording == false) {
      toast.error("There was some error creating the room");
      return;
    }

    if (room) {
      setIsRoomCreating(false);
      setRoomName(room.name);
      router.push(`/room/${data.roomId}`);
    } else {
      toast.error("Room Doesn't exists");
    }
  };

  const moveToPastRecordings = () => {
    router.push("/recordings");
  };
  return (
    <div className="flex flex-col gap-5">
      <Dialog>
        <DialogTrigger asChild>
          <Card className="bg-[linear-gradient(to_bottom,_#f5f5f5,_#f5f5f5,_#f5f5f5,_#262626)] dark:bg-[linear-gradient(to_bottom,_#424242,_#424242,_#262626,_#262626)] border-none  p-6 rounded-3xl transition-transform duration-300 hover:scale-105">
            <div className="flex flex-row gap-3 items-center ">
              <div className="p-7 bg-black rounded-xl">
                <AlignCenterHorizontal className="w-8 h-8 text-amber-600" />
              </div>
              <div className="flex flex-col ">
                <div className="text-xl font-bold">CREATE ROOM</div>
                <div className="w-40 text-xs">
                  Create a room, share the ID, and chat with up to 8 people in
                  real-time
                </div>
              </div>
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]  border-none px-10 py-10 bg-[linear-gradient(to_bottom,_#1c1c1c,_#1c1c1c,_#262626,_#262626)] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create a room</DialogTitle>
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
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? roomParticipantsNumber.find(
                                    (numberOfParticipants) =>
                                      numberOfParticipants.value === field.value
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
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-amber-600 text-white w-full"
                >
                  <LoadingSwap isLoading={isLoading}> Create</LoadingSwap>
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Card className="bg-[linear-gradient(to_bottom,_#f5f5f5,_#f5f5f5,_#f5f5f5,_#262626)] dark:bg-[linear-gradient(to_bottom,_#424242,_#424242,_#262626,_#262626)] border-none border-1 p-6 rounded-3xl transition-transform duration-300 hover:scale-105">
            <div className="flex flex-row gap-3 items-center">
              <div className="p-7 bg-black rounded-xl">
                <LogIn className="w-8 h-8 text-amber-600" />
              </div>
              <div className="flex flex-col ">
                <div className="text-xl font-bold">JOIN ROOM</div>
                <div className="w-40 text-xs">
                  Join a room using the shared ID and jump straight into the
                  conversation
                </div>
              </div>
            </div>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]  border-none px-10 py-10 bg-[linear-gradient(to_bottom,_#1c1c1c,_#1c1c1c,_#262626,_#262626)] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Join room</DialogTitle>

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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-amber-600 text-white w-full"
                >
                  <LoadingSwap isLoading={isLoading}>Join</LoadingSwap>
                </Button>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      <Card
        onClick={moveToPastRecordings}
        className="bg-[linear-gradient(to_bottom,_#f5f5f5,_#f5f5f5,_#f5f5f5,_#262626)] dark:bg-[linear-gradient(to_bottom,_#424242,_#424242,_#262626,_#262626)] border-none border-1 p-6 rounded-3xl transition-transform duration-300 hover:scale-105"
      >
        <div className="flex flex-row gap-3 items-center">
          <div className="p-7 bg-black rounded-xl">
            <List className="w-8 h-8 text-amber-600" />
          </div>
          <div className="flex flex-col ">
            <div className="text-xl font-bold">PAST RECORDING</div>
            <div className="w-40 text-xs">
              Access and listen to your past recordings anytime, all in one
              placex
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
