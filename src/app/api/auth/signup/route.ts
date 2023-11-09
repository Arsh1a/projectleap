import { SignUpSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    //Validation
    const validation = await SignUpSchema.safeParseAsync({
      email,
      password,
      name,
    });
    if (!validation.success) {
      const { errors } = validation.error;
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    //Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    //Insert to DB
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ email, name });
  } catch (err) {
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
