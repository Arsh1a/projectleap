import { Logo } from "@/components/ui/logo";
import React from "react";

interface Props {}

const DashboardAside = ({}: Props) => {
  return (
    <aside className="py-6 px-8">
      <Logo />
      <ul></ul>
    </aside>
  );
};

export default DashboardAside;
