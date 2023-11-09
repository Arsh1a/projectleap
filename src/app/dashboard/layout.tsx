import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import DashboardNavbar from "./dashboard-navbar";
import { getServerSession } from "next-auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  console.log("session", session);

  return (
    <>
      <DashboardNavbar
        profilePicture={session!.user!.image}
        name={session!.user!.name!}
      />
    </>
  );
}
