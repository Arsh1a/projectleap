"use client";

import { FormEvent, FormHTMLAttributes, useState } from "react";
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

export default function SignUpForm() {
  const signupForm = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { email: "", password: "", fullName: "" },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: SignUpSchemaType) => postData("/api/auth/signup", data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const router = useRouter();

  const handleSignUp: SubmitHandler<SignUpSchemaType> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <div>
      <Form {...signupForm}>
        <form
          onSubmit={signupForm.handleSubmit(handleSignUp)}
          className="space-y-5"
        >
          <FormField
            control={signupForm.control}
            name="fullName"
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" size="lg">
            Sign up
          </Button>
        </form>
      </Form>
    </div>
  );
}
