import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import db from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { ProjectOperationSchema } from "@/lib/validation";

export async function POST(req: Request & NextApiRequest, res: Response) {
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

  const existingProject = await db.project.findFirst({
    where: { name, ownerId: user.id },
  });

  if (existingProject) {
    return NextResponse.json(
      { error: "User already has a project with the same name." },
      { status: 400 }
    );
  }

  const project = await db.project.create({
    data: {
      name,
      deadline,
      description,
      ownerId: user.id,
    },
  });

  return NextResponse.json(project);
}

export async function GET(req: Request & NextApiRequest, res: Response) {
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

  const userProjects = await db.project.findMany({
    where: { ownerId: user.id },
  });

  return NextResponse.json(userProjects);
}
