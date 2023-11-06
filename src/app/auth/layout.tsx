import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container className="w-full sm:w-[400px] flex flex-col gap-5 items-center justify-center h-screen">
      <Logo />
      <div className="w-full">{children}</div>
    </Container>
  );
}
