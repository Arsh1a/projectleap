import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import db from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { TaskUpdateSchema } from "@/lib/validation";

export async function PATCH(
  req: Request & NextApiRequest,
  res: Response,
  { params }: { params: { id: string } }
) {
  const { title, description, status, dueDate, priority } = await req.json();

  //Validation
  const validation = await TaskUpdateSchema.safeParseAsync({
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

  const task = await db.task.update({
    where: {
      id: params.id,
      project: {
        users: {
          some: {
            id: user.id,
          },
        },
      },
    },
    data: {
      title,
      description,
      status,
      dueDate,
      priority,
    },
  });

  if (!task) {
    return NextResponse.json(
      { error: "There was a problem updating the task." },
      { status: 500 }
    );
  }

  return NextResponse.json(task);
}

export async function DELETE(
  req: Request & NextApiRequest,
  res: Response,
  { params }: { params: { id: string } }
) {
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

  const task = await db.task.delete({
    where: { id: params.id, project: { users: { some: { id: user.id } } } },
  });

  if (!task) {
    return NextResponse.json(
      { error: "There was a problem deleting the task." },
      { status: 500 }
    );
  }

  return NextResponse.json(task);
}
