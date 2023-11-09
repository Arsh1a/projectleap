import { Logo } from "@/components/ui/logo";
import Image from "next/image";
import React from "react";
import UserDropdown from "./user-dropdown";

interface Props {
  profilePicture: string | null | undefined;
  name: string;
}

const DashboardNavbar = ({ profilePicture, name }: Props) => {
  return (
    <nav className="py-4 px-6 m-6 flex items-center border rounded-l-3xl rounded-r-[5rem]">
      <Logo />
      <div className="ml-auto flex items-center">
        <UserDropdown
          label={name}
          trigger={
            <Image
              className="rounded-full"
              src={profilePicture ?? "/portrait.png"}
              alt="Profile Picture"
              height={50}
              width={50}
            />
          }
        />
      </div>
    </nav>
  );
};

export default DashboardNavbar;
