"use client";
import DottedSeparatoo from "@/components/dotted-separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  inferSignInSchema,
  SignInSchema,
} from "@/validations/auth/sign-in-schema";
import Link from "next/link";
import { useLogin } from "../api/use-login";
import { Loader } from "lucide-react";
import { signUpWithGithub, signUpWithGoogle } from "@/lib/oAuth";

export default function SignInCard() {
  // mutation
  const { mutate, isPending } = useLogin();

  const form = useForm<inferSignInSchema>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: inferSignInSchema) => {
    mutate(data);
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none mb-10">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>

      <div className="px-7 mb-2">
        <DottedSeparatoo />
      </div>

      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label>Email</Label>
                  <FormControl>
                    <Input
                      type="email"
                      disabled={isPending}
                      placeholder="Enter Your Email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label>Password</Label>
                  <FormControl>
                    <Input
                      type="password"
                      disabled={isPending}
                      placeholder="Enter Your Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              size={"lg"}
              className="w-full"
            >
              {isPending ? <Loader className="animate-spin size-4" /> : "Login"}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardContent className="flex flex-col gap-3">
        <Button
          onClick={() => signUpWithGoogle()}
          variant={"secondary"}
          disabled={isPending}
          size={"lg"}
          className="w-full"
        >
          <FcGoogle />
          Sign In With Google
        </Button>
        <Button
          onClick={() => signUpWithGithub()}
          variant={"secondary"}
          disabled={isPending}
          size={"lg"}
          className="w-full"
        >
          <FaGithub />
          Sign In With GitHub
        </Button>
      </CardContent>

      <CardContent>
        <p className="text-center">
          Don&apos;t have an account?
          <Link href={"/sign-up"}>
            <span className="text-blue-700">&nbsp;Sign Up</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
