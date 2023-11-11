import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import db from "@/lib/db";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request & NextApiRequest, res: Response) {
  const { name, description, deadline } = await req.json();

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

  const project = await db.project.create({
    data: {
      name,
      description,
      userId: user.id,
      ownerId: user.id,
    },
  });

  return NextResponse.json(project);
}
