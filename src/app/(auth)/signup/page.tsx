import { SignUp } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import SignUpForm from "./SignupForm";

export default function DashboadPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SignUpForm />
    </main>
  );
}
