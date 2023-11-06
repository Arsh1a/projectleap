import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { users } from "@/db/schema";
import Image from "next/image";

export default async function HomePage() {
  const data = await db.select().from(users);

  console.log(data);

  return (
    <main>
      <Button>HEY</Button>
    </main>
  );
}
