"use client";

import { FormEvent, FormHTMLAttributes, useState } from "react";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(20),
});
type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });

  const { isLoaded, signUp, setActive } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const router = useRouter();

  const handleSignup: SubmitHandler<SignUpSchemaType> = async (data) => {
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
        <form onSubmit={handleSubmit(handleSignup)}>
          <input className="input" placeholder="email" {...register("email")} />
          {errors.email && <span>{errors.email.message}</span>}

          <input
            className="input"
            placeholder="password"
            {...register("password")}
          />
          {errors.password && <span>{errors.password.message}</span>}

          <button type="submit">Sign up</button>
        </form>
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
