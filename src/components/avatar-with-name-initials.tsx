import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getNameInitials } from "@/lib/utils";

interface Props {
  avatar: string | null | undefined;
  name: string;
}

const AvatarWwithNameInitials = ({ avatar, name }: Props) => {
  return (
    <Avatar className="h-10 w-10">
      <AvatarImage src={avatar!} alt={"User image"} />
      <AvatarFallback>{getNameInitials(name)}</AvatarFallback>
    </Avatar>
  );
};

export default AvatarWwithNameInitials;
