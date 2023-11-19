"use client";
import { isoToReadableDate } from "@/lib/utils";
import { ProjectDataType } from "@/lib/validation";
import { ColumnDef } from "@tanstack/react-table";

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
      return isoToReadableDate(row.getValue("createdAt"));
    },
  },
  {
    accessorKey: "deadline",
    header: "Deadline",
    cell: ({ row }) => {
      return isoToReadableDate(row.getValue("deadline"));
    },
  },
];
