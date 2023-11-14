import { Logo } from "@/components/ui/logo";
import React from "react";
import UserDropdown from "./user-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProjectPopover from "./project-popover";
import AvatarWwithNameInitials from "@/components/avatar-with-name-initials";

interface Props {
  profilePicture: string | null | undefined;
  name: string;
}

const DashboardNavbar = ({ profilePicture, name }: Props) => {
  return (
    <nav className="flex items-center border-b gap-10 px-4 py-2">
      <Logo />
      <ul className="flex items-center text-sm font-medium">
        <li className="text-muted-foreground">Dashboard</li>
      </ul>
      <div className="ml-auto flex gap-4 items-center">
        <ProjectPopover />
        <UserDropdown
          label={name}
          trigger={
            <AvatarWwithNameInitials avatar={profilePicture} name={name} />
          }
        />
      </div>
    </nav>
  );
};

export default DashboardNavbar;
