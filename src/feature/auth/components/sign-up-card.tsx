import DottedSeparatoo from "@/components/dotted-separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useForm } from "react-hook-form";
import {
  inferSignUpSchema,
  SignUpSchema,
} from "@/validations/auth/sign-up-schema";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useRegister } from "../api/use-register";

export default function SignUpCard() {
  // mutation
  const { mutate } = useRegister();

  const form = useForm<inferSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: inferSignUpSchema) => {
    mutate(data);
  };

  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By Signin up, you agree to our{" "}
          <Link href={"/privacy"} className="text-blue-700">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href={"/terms"} className="text-blue-700">
            Terms of Service
          </Link>
        </CardDescription>
      </CardHeader>

      <div className="px-7 mb-2">
        <DottedSeparatoo />
      </div>

      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label>Name</Label>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Your Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <Label>Email</Label>
                  <FormControl>
                    <Input
                      type="email"
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
                      placeholder="Enter Your Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" size={"lg"} className="w-full">
              Login
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardContent className="flex flex-col gap-3">
        <Button
          variant={"secondary"}
          disabled={false}
          size={"lg"}
          className="w-full"
        >
          <FcGoogle />
          Sign In With Google
        </Button>
        <Button
          variant={"secondary"}
          disabled={false}
          size={"lg"}
          className="w-full"
        >
          <FaGithub />
          Sign In With GitHub
        </Button>
      </CardContent>

      <CardContent>
        <p className="text-center">
          Already have an account?
          <Link href={"/sign-in"}>
            <span className="text-blue-700">&nbsp;Sign In</span>
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
