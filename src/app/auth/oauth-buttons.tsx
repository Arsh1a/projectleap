import { Button } from "@/components/ui/button";
import { Seperator } from "@/components/ui/seperator";
import { Github } from "lucide-react";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

const OAuthButtons = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="w-full">
      <Seperator text="or" />
      <Button
        isLoading={isLoading}
        variant="outline"
        className="w-full py-6"
        onClick={() => {
          setIsLoading(true);
          signIn("github", { callbackUrl: "/dashboard", redirect: false });
        }}
      >
        <Github size={16} />
        <span className="ml-1 text-base">Continue with Github</span>
      </Button>
    </div>
  );
};

export default OAuthButtons;
