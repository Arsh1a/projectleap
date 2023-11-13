import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import db from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { TagCreateSchema, TaskGetSchema } from "@/lib/validation";
import { Prisma } from "@prisma/client";

export async function POST(req: Request & NextApiRequest, res: Response) {
  const { projectId, title, description, status, dueDate, priority } =
    await req.json();

  //Validation
  const validation = await TagCreateSchema.safeParseAsync({
    projectId,
    title,
    description,
    status,
    dueDate,
    priority,
  });
  if (!validation.success) {
    const { errors } = validation.error;
    return NextResponse.json({ error: errors }, { status: 400 });
  }

  //Authorization
  const session = await getToken({ req });
  if (!session || !session.email) {
    return NextResponse.json(
      { error: "User is not logged in." },
      { status: 401 }
    );
  }

  const user = await db.user.findUnique({ where: { email: session.email } });

  if (!user) {
    return NextResponse.json({ error: "User doesn't exist." }, { status: 401 });
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
      users: {
        some: {
          id: user.id,
        },
      },
    },
  });

  if (!project) {
    return NextResponse.json(
      { error: "Project with that user in it does not exist." },
      { status: 400 }
    );
  }

  const task = await db.task.create({
    data: {
      projectId,
      title,
      description,
      status,
      dueDate,
      priority,
    },
  });

  if (!task) {
    return NextResponse.json(
      { error: "There was a problem creating the task." },
      { status: 500 }
    );
  }

  return NextResponse.json(task);
}

export async function GET(req: Request & NextApiRequest, res: Response) {
  const { limit = 20, page = 1, text, status, priority, tags } = req.query;
  const { projectId } = await req.json();
  //Validation
  const validation = await TaskGetSchema.safeParseAsync({
    projectId,
    text,
    status,
    priority,
    tags,
  });
  if (!validation.success) {
    const { errors } = validation.error;
    return NextResponse.json({ error: errors }, { status: 400 });
  }
  const validatedLimit = parseInt(limit as string) ?? 20;
  const validatedPage = parseInt(page as string) ?? 1;
  const validatedText = text?.toString() ?? undefined;
  const validatedStatus = status?.toString().split(",") ?? undefined;
  const validatedPriority = Number(priority) ?? undefined;
  const validatedTags = tags?.toString().split(",") ?? undefined;

  const session = await getToken({ req });
  if (!session || !session.email) {
    return NextResponse.json(
      { error: "User is not logged in." },
      { status: 401 }
    );
  }

  const user = await db.user.findUnique({ where: { email: session.email } });

  if (!user) {
    return NextResponse.json({ error: "User doesn't exist." }, { status: 401 });
  }

  const filter = {
    projectId,
    OR: [
      {
        title: {
          contains: validatedText,
          mode: "insensitive",
        },
        description: {
          contains: validatedText,
          mode: "insensitive",
        },
      },
    ],
    status: {
      in: validatedStatus,
    },
    tags: {
      some: {
        name: {
          in: validatedTags,
        },
      },
    },
  } satisfies Prisma.TaskFindManyArgs["where"];

  const tasks = await db.task.findMany({
    take: validatedLimit,
    skip: (validatedPage - 1) * validatedLimit,
    orderBy: [{ priority: "asc" }],
    where: filter,
  });

  const totalTasks = await db.task.count({
    where: filter,
  });
  const totalPages = Math.ceil(totalTasks / validatedLimit);

  return NextResponse.json({ totalPages, totalData: totalTasks, data: tasks });
}
