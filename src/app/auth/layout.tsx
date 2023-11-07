import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <Container className="w-full sm:w-[400px] flex flex-col gap-5 items-center justify-center h-screen">
      <Logo />
      <div className="w-full">{children}</div>
    </Container>
  );
}
