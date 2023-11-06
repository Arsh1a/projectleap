"use client";

import { FormEvent, FormHTMLAttributes, useState } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
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

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20),
});
type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export default function SignUpForm() {
  const signupForm = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
  });

  const { isLoaded, signUp, setActive } = useSignUp();
  const { signIn } = useSignIn();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSignUp: SubmitHandler<SignUpSchemaType> = async (data) => {
    if (!isLoaded) {
      return;
    }

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const handleVerification = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isLoaded) {
      return;
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status !== "complete") {
        /*  investigate the response, to see if there was an error
         or if the user needs to complete more steps.*/
        console.log(JSON.stringify(completeSignUp, null, 2));
      }
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.push("/");
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <div>
      {!pendingVerification && (
        <Form {...signupForm}>
          <form
            onSubmit={signupForm.handleSubmit(handleSignUp)}
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
            {signUp && (
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  return signUp.authenticateWithRedirect({
                    strategy: "oauth_github",
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: "/",
                  });
                }}
              >
                Countinue with Github
              </Button>
            )}
            {signIn && (
              <Button
                variant="outline"
                type="button"
                onClick={() => {
                  return signIn.authenticateWithRedirect({
                    strategy: "oauth_github",
                    redirectUrl: "/sso-callback",
                    redirectUrlComplete: "/",
                  });
                }}
              >
                Login with Github
              </Button>
            )}
            <Button type="submit" className="w-full" size="lg">
              Sign up
            </Button>
          </form>
        </Form>
      )}
      {pendingVerification && (
        <div>
          <form onSubmit={handleVerification}>
            <input
              value={code}
              placeholder="Code..."
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit">Verify Email</button>
          </form>
        </div>
      )}
    </div>
  );
}
