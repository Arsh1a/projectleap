import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { headers } from "next/headers";
import { ProjectsDataTable } from "./projects-data-table";
import { projectsDataTableColumns } from "./projects-data-table-columns";
import { PlusCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default async function DashboadPage() {
  const data = await fetch(
    `${process.env.NEXT_PUBLIC_WEBSITE_URL}/api/project`,
    {
      method: "GET",
      headers: headers(),
    }
  )
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      return res;
    });

  return (
    <main>
      <Container>
        <div className="mb-10 flex items-center justify-between gap-5 flex-wrap">
          <div>
            <h1 className="text-xl font-medium">Dashboard</h1>
            <p>Manage your projects.</p>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button className="gap-1" size="sm">
                <PlusCircle size={18} /> Create new project
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Create new project</SheetTitle>
                <SheetDescription>Project from</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
        <ProjectsDataTable columns={projectsDataTableColumns} data={data} />
      </Container>
    </main>
  );
}
