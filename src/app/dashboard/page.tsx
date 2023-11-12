import { Button } from "@/components/ui/button";
import { headers } from "next/headers";

export default function DashboadPage() {
  //post request to "http://localhost:3000/api/project/create"
  fetch("http://localhost:3000/api/project/", {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ name: "project" }),
  })
    .then((res) => res.json())
    .then((res) => console.log(res));

  return (
    <main>
      <Button>Dashboard</Button>
    </main>
  );
}
