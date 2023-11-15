import { PlusCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ProjectForm from "./project-form";
import { Button } from "@/components/ui/button";

const ProjectSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="gap-1" size="sm" variant="secondary">
          <PlusCircle size={18} /> Create new project
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create new project</SheetTitle>
          <SheetDescription>
            <ProjectForm />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default ProjectSheet;
