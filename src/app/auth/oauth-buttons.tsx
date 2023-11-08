import { Button } from "@/components/ui/button";
import { Seperator } from "@/components/ui/seperator";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import React from "react";

interface Props {
  type: "signup" | "login";
}

const OAuthButtons = ({ type }: Props) => {
  return (
    <div className="w-full">
      <Seperator text="or" />
      <Button
        variant="outline"
        className="w-full py-6"
        onClick={() =>
          signIn("github", { callbackUrl: "/dashboard", redirect: false })
        }
      >
        <Github />
        <span className="ml-1">
          {type === "login" ? "Login" : "Sign up"} in with Github
        </span>
      </Button>
    </div>
  );
};

export default OAuthButtons;
