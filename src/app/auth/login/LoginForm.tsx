"use client";

import { FormEvent, FormHTMLAttributes, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { LoginSchemaType, LoginSchema } from "@/lib/validation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const signupForm = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: LoginSchemaType) => postData("/api/auth/login", data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });

  const query = useSearchParams();

  useEffect(() => {
    console.log(query.get("error"));
  }, [query]);

  const handleLogin: SubmitHandler<LoginSchemaType> = async (data) => {
    await signIn("credentials", {
      callbackUrl: "/",
      redirect: true,
      ...data,
    });
  };

  return (
    <div>
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
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" size="lg">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
