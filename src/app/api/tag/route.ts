import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import db from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { TagCreateSchema, TagGetSchema } from "@/lib/validation";

export async function POST(req: Request & NextApiRequest, res: Response) {
  const { projectId, name, color } = await req.json();

  //Validation
  const validation = await TagCreateSchema.safeParseAsync({
    projectId,
    name,
    color,
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

  const tag = await db.tag.create({ data: { projectId, name, color } });

  if (!tag) {
    return NextResponse.json(
      { error: "There was a problem creating the tag." },
      { status: 500 }
    );
  }

  return NextResponse.json(tag);
}

export async function GET(req: Request & NextApiRequest, res: Response) {
  const { projectId } = await req.json();

  //Validation
  const validation = await TagGetSchema.safeParseAsync({
    projectId,
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

  const tags = await db.tag.findMany({ where: { projectId } });

  if (!tags) {
    return NextResponse.json(
      { error: "There was a problem getting the tags." },
      { status: 500 }
    );
  }

  return NextResponse.json(tags);
}
