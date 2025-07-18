"use client";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyUserExists } from "@/feature/auth/actions/verifyUserExists";
import { sendOTPEmail } from "@/services/nodemailer/sendEmail";
import { addTempUser } from "@/feature/auth/db/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoadingSwap } from "@/components/LoadingSwap";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name is required.",
    })
    .max(50, {
      message: "Name must be less than 50 characters.",
    }),
  email: z
    .string()
    .min(2, {
      message: "Email is required.",
    })
    .email(),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters.",
    })
    .refine(
      (val) => {
        const hasUppercase = /[A-Z]/.test(val);
        const hasLowercase = /[a-z]/.test(val);
        const hasNumber = /\d/.test(val);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(val);
        return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
      },
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }
    ),
});

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const router = useRouter();
  type FormData = z.infer<typeof FormSchema>;

  const handleSignup = async (data: FormData) => {
    setIsLoading(true);
    const response = await verifyUserExists(data.email);
    if (!response) {
      const tempUserId = await addTempUser({
        name: data.name,
        email: data.email,
        password: data.password,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      await sendOTPEmail(data.email, tempUserId);
      const searchParams = new URLSearchParams({
        email: data.email,
        id: tempUserId.toString(),
      });

      router.push(`/signup/verifyotp?${searchParams.toString()}`);
      console.log("User added successfully");
      setIsLoading(false);
    } else {
      setIsLoading(false);
      toast.error("User already exists. Please login instead.");
      return;
    }
  };

  return (
    <Card className="w-170 h-170 border-none bg-[linear-gradient(to_bottom,_#1b3784,_#171717,_#171717,_#171717)] flex flex-col justify-center p-10 rounded-4xl">
      <div className="flex flex-col gap-3 justify-center items-center">
        {/* <div className="text-3xl font-bold w-50 border-amber-700 border-2 p-3 rounded-xl bg-black text-white">
          Sign up
        </div> */}
        <div className="text-4xl font-bold">Sign Up</div>
        <div className="text-gray-400">
          Enter the below details to create an account
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSignup)}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormDescription>Enter your full name.</FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormDescription>
                      Enter a valid email address.
                    </FormDescription>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormDescription>Enter a strong password.</FormDescription>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <br />
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-amber-600 text-white p-5 "
              disabled={isLoading}
            >
              <LoadingSwap isLoading={isLoading}>Signup</LoadingSwap>
            </Button>
            <Button asChild className="w-full p-5">
              <Link href="/login">Login</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
