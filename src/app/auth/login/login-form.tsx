"use client";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginSchemaType, LoginSchema } from "@/lib/validation";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import OAuthButtons from "../oauth-buttons";
import Link from "next/link";

const LoginForm = () => {
  const [formLoading, setFormLoading] = useState(false);

  const signupForm = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: undefined, password: undefined },
  });

  const router = useRouter();
  const { toast } = useToast();

  //This is little messy cause we have to use next-auth signIn instead of tanstack query.

  const handleLogin: SubmitHandler<LoginSchemaType> = async (data) => {
    setFormLoading(true);
    const signInResponse = await signIn("credentials", {
      redirect: false,
      ...data,
    });

    if (signInResponse?.error) {
      setFormLoading(false);
      if (signInResponse?.error === "CredentialsSignin") {
        toast({
          variant: "destructive",
          title: "Invalid email or password.",
          description:
            "Please double-check your login credentials and try again.",
        });
        return;
      }

      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      return;
    }

    setFormLoading(false);
    router.push("/dashboard");
  };

  return (
    <div>
      <p className="text-sm mb-4 text-center">
        New to Project Leap?{" "}
        <Link className="underline font-semibold" href={"/auth/signup"}>
          Sign up
        </Link>
        .
      </p>
      <Form {...signupForm}>
        <form
          onSubmit={signupForm.handleSubmit(handleLogin)}
          className="space-y-5"
        >
          <FormField
            control={signupForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={signupForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={formLoading}
          >
            Login
          </Button>
        </form>
      </Form>
      <OAuthButtons />
    </div>
  );
};

export default LoginForm;
