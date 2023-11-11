import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import DashboardNavbar from "./dashboard-navbar";
import { getServerSession } from "next-auth";
import DashboardAside from "./dashboard-aside";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <div>
      <DashboardNavbar
        profilePicture={session!.user!.image}
        name={session!.user!.name!}
      />
    </div>
  );
}
