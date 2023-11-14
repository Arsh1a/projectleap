"use client";
import { ProjectDataType } from "@/lib/validation";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const projectsDataTableColumns: ColumnDef<ProjectDataType>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "createdAt",
    header: "Creation",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
      } as const;
      const dateFormatter = new Intl.DateTimeFormat("en-US", options);

      return dateFormatter.format(date);
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
  },
];
