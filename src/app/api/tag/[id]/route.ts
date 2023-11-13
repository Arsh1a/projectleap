import { NextResponse } from "next/server";
import { NextApiRequest } from "next";
import db from "@/lib/db";
import { getToken } from "next-auth/jwt";
import { TagUpdateSchema } from "@/lib/validation";

export async function PATCH(
  req: Request & NextApiRequest,
  res: Response,
  { params }: { params: { id: string } }
) {
  const { name, color } = await req.json();

  //Validation
  const validation = await TagUpdateSchema.safeParseAsync({
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

  const tag = await db.tag.update({
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
    data: { name, color },
  });

  if (!tag) {
    return NextResponse.json(
      { error: "There was a problem updating the tag." },
      { status: 500 }
    );
  }

  return NextResponse.json(tag);
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

  const tag = await db.tag.delete({
    where: { id: params.id, project: { users: { some: { id: user.id } } } },
  });

  if (!tag) {
    return NextResponse.json(
      { error: "There was a problem deleting the tag." },
      { status: 500 }
    );
  }

  return NextResponse.json(tag);
}
