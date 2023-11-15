import { Container } from "@/components/ui/container";
import { headers } from "next/headers";
import { ProjectsDataTable } from "./projects-data-table";
import { projectsDataTableColumns } from "./projects-data-table-columns";
import ProjectSheet from "./project-sheet";

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
          <ProjectSheet />
        </div>
        <ProjectsDataTable columns={projectsDataTableColumns} data={data} />
      </Container>
    </main>
  );
}
