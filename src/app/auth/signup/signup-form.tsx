"use client";

import { FormEvent, FormHTMLAttributes, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { register } from "module";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postData } from "@/lib/api";
import { SignUpSchemaType, SignUpSchema } from "@/lib/validation";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { signIn } from "next-auth/react";
import { Github } from "lucide-react";
import OAuthButtons from "../oauth-buttons";
import Link from "next/link";

export default function SignUpForm() {
  const signupForm = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { email: "", password: "", name: "" },
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mutation = useMutation({
    mutationFn: (data: SignUpSchemaType) => postData("/api/auth/signup", data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      router.push("/dashboard");
      const timeout = setTimeout(() => {
        toast({
          variant: "default",
          title: "Account created succesfuly.",
          description: "Please login with your credintials.",
          action: (
            <ToastAction
              altText="Try again"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </ToastAction>
          ),
        });
      }, 0);

      return () => clearTimeout(timeout);
    },
    onError: () => {
      const timeout = setTimeout(() => {
        toast({
          variant: "destructive",
          title: "User already exists.",
          description: "If you are the owner of the account, you can login.",
          action: (
            <ToastAction
              altText="Try again"
              onClick={() => router.push("/auth/login")}
            >
              Login
            </ToastAction>
          ),
        });
      }, 0);

      return () => clearTimeout(timeout);
    },
  });

  const router = useRouter();

  const handleSignUp: SubmitHandler<SignUpSchemaType> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <p className="text-sm mb-4 text-center">
        Already have an account?{" "}
        <Link className="underline font-semibold" href={"/auth/login"}>
          Login
        </Link>
        .
      </p>
      <Form {...signupForm}>
        <form
          onSubmit={signupForm.handleSubmit(handleSignUp)}
          className="space-y-5"
        >
          <FormField
            control={signupForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            variant="secondary"
            size="lg"
            isLoading={mutation.isPending}
          >
            Sign up
          </Button>
        </form>
      </Form>
      <OAuthButtons type="signup" />
    </div>
  );
}
