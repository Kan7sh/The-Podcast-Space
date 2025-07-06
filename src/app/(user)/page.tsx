"use client";

import SignedIn from "@/components/SignedIn";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDown, Check } from "lucide-react";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function Home() {
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
    language: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      language: "5", // Set default to 5 participants
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
  }

  return (
    <SignedIn>
      <div className="grid grid-rows items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <Button onClick={logout}>Logout</Button>
        <Button>Profile</Button>
        <Button>About</Button>
        <Dialog>
          <form>
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
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Room name</Label>
                  <Input id="name-1" name="roomName" />
                </div>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="language"
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
                                    {roomParticipantsNumber.map(
                                      (participant) => (
                                        <CommandItem
                                          value={participant.label}
                                          key={participant.value}
                                          onSelect={() => {
                                            form.setValue(
                                              "language",
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
                                      )
                                    )}
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
          </form>
        </Dialog>

        <Button>Join a Room</Button>
        <Button>Past recordings</Button>
      </div>
    </SignedIn>
  );
}
