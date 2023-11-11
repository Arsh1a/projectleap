import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function HomePage() {
  return (
    <main>
      <Button variant="destructive" className="bg-muted text-foreground">
        HEY
      </Button>
    </main>
  );
}
