"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyEmailOtp } from "@/services/nodemailer/verifyOtp";
import { moveFromTempToUser } from "../actions/moveFromTempToUser";
import { LoadingSwap } from "@/components/LoadingSwap";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const FormSchema = z.object({
  pin: z.string().min(4, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function VerifyOtpCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const id = Number(searchParams.get("id")) || 0;
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const isOtpVeriffied = await verifyEmailOtp(id, email, data.pin);

    if (isOtpVeriffied) {
      const isUserMoved = await moveFromTempToUser(id);
      if (isUserMoved) {
        toast.success(
          "Email verified successfully!. Please login to continue."
        );
        router.push("/login");
      } else {
        toast.error(
          "There was an error verifying your email. Please try again."
        );
      }
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
    setIsLoading(false);
  }

  return (
    <Card className=" lg:w-170 lg:h-170  border-none bg-[linear-gradient(to_bottom,_#1b3784,_#171717,_#171717,_#171717)] flex flex-col justify-center p-11 rounded-4xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Verify Your Email</h1>
            <p className="text-muted-foreground m-4">
              Enter the verification code sent to your email
            </p>
          </div>

          <FormField
            control={form.control}
            name="pin"
            render={({ field }) => (
              <FormItem className="text-center">
                <FormLabel className="text-center block m-3">
                  One-Time Password
                </FormLabel>
                <FormControl>
                  <div className="flex justify-center">
                    <InputOTP maxLength={4} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} className="size-18 text-xl" />
                        <InputOTPSlot index={1} className="size-18 text-xl" />
                        <InputOTPSlot index={2} className="size-18 text-xl" />
                        <InputOTPSlot index={3} className="size-18 text-xl" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormDescription className="text-center m-4">
                  Please enter the one-time password sent to your email:{" "}
                  <span className="font-medium">{email}</span>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              className="w-100 p-5 bg-amber-600 text-white"
              disabled={isLoading}
            >
              <LoadingSwap isLoading={isLoading}>Submit</LoadingSwap>
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
