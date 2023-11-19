import { Logo } from "@/components/ui/logo";
import React from "react";
import UserDropdown from "./user-dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AvatarWwithNameInitials from "@/components/avatar-with-name-initials";
import { ThemeToggle } from "@/components/theme-provider";

interface DashboardNavbarProps {
  profilePicture: string | null | undefined;
  name: string;
}

const DashboardNavbar = ({ profilePicture, name }: DashboardNavbarProps) => {
  return (
    <nav className="px-8 pt-8">
      <div className="flex items-center border rounded-full gap-10 px-6 py-3">
        <Logo />
        <ul className="flex items-center text-sm font-medium">
          <li className="text-muted-foreground">Dashboard</li>
        </ul>
        <div className="ml-auto flex gap-4 items-center">
          <ThemeToggle />
          <UserDropdown
            label={name}
            trigger={
              <AvatarWwithNameInitials avatar={profilePicture} name={name} />
            }
          />
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
