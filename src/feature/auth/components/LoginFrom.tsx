"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { LoadingSwap } from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export function LoginFrom() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGooleLoginLoading, setIsGooleLoginLoading] = useState(false);
  const session = useSession();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (session.status === "loading") {
    return (
      <div className="h-screen w-screen flex items-center justify-center self-center">
        <LoadingSpinner />
      </div>
    );
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });
    setIsLoading(false);
    console.log(res);
    if (res?.ok) {
      redirect("/");
    } else {
      toast.error("Invalid email or password. Please try again.");
    }
  };

  const signinWithGoogle = async () => {
    setIsGooleLoginLoading(true);
    const res = await signIn("google", { redirect: false });
    setIsGooleLoginLoading(false);
    if (res?.ok) {
      router.push("/");
    }
  };

  return (
    <Card className="w-full h-full rounded-4xl flex flex-col justify-center border-none shadow-none bg-transparent ">
      <div className="flex flex-col gap-3 justify-center items-center">
        <div className="text-2xl font-bold">Login to your account</div>
        <div className="text-gray-400">
          Enter your email below to login to your account
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <br />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                </FormItem>
              )}
            />
            <br />
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button
              type="submit"
              className="w-full cursor-pointer p-5 bg-amber-600 text-white"
              disabled={isLoading}
            >
              <LoadingSwap isLoading={isLoading}>Login</LoadingSwap>
            </Button>
            <Button
              onClick={signinWithGoogle}
              className="w-full cursor-pointer p-5"
              disabled={isGooleLoginLoading}
            >
              <FcGoogle className="w-8 h-8" />
              <LoadingSwap isLoading={isGooleLoginLoading}>
                Login with Google
              </LoadingSwap>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full cursor-pointer p-"
            >
              <Link href={"/signup"}>Signup</Link>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
