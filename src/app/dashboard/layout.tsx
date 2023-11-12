import { getServerSession } from "next-auth";
import DashboardNavbar from "../_components/dashboard/dashboard-navbar";

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
