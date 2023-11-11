import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowDownUp } from "lucide-react";
import React from "react";

interface Props {}

const ProjectPopover = ({}: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Select a project"
          className="text-sm gap-1 w-[200px] justify-between"
        >
          <span>Project name</span>
          <ArrowDownUp size={14} strokeWidth={1} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px]">
        Place content for the popover here.
      </PopoverContent>
    </Popover>
  );
};

export default ProjectPopover;
