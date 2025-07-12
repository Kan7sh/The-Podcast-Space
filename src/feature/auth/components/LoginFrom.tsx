"use client";

import { LoadingSwap } from "@/components/LoadingSwap";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export function LoginFrom() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
    });
    setIsLoading(false);
    console.log(res);
    if (res?.ok) {
      router.push("/");
    } else {
      toast.error("Invalid email or password. Please try again.");
    }
  };

  const signinWithGoogle = async () => {
    const res = await signIn("google", { redirect: true });
    if (res?.ok) {
      router.push("/");
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="text-xl font-semibold">
        <Card className="w-full min-w-md">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
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
                  className="w-full cursor-pointer"
                  disabled={isLoading}
                >
                  <LoadingSwap isLoading={isLoading}>Login</LoadingSwap>
                </Button>
                <Button
                  onClick={signinWithGoogle}
                  className="w-full cursor-pointer"
                >
                  <FcGoogle className="w-5 h-5" />
                  Login with Google
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full cursor-pointer"
                >
                  <Link href={"/signup"}>Signup</Link>
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
