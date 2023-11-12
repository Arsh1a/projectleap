import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import db from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { ProjectOperationSchema } from "@/lib/validation";

export async function PATCH(
  req: Request & NextApiRequest,
  res: Response,
  { params }: { params: { id: string } }
) {
  const { name, description, deadline } = await req.json();

  //Validation
  const validation = await ProjectOperationSchema.safeParseAsync({
    name,
    description,
    deadline,
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

  const updatedProject = await db.project.update({
    where: { id: params.id },
    data: {
      name,
      deadline,
      description,
    },
  });

  if (!updatedProject) {
    return NextResponse.json(
      { error: "Project does not exist." },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedProject);
}

export async function DELETE(
  req: Request & NextApiRequest,
  res: Response,
  { params }: { params: { id: string } }
) {
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

  //Only owner can delete project
  const project = await db.project.delete({
    where: { id: params.id, ownerId: user.id },
  });
  if (!project) {
    return NextResponse.json(
      { error: "Project does not exist." },
      { status: 404 }
    );
  }

  return NextResponse.json(project);
}
