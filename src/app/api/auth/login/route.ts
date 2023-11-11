import db from "@/lib/db";
import { LoginSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    //Validation
    const validation = await LoginSchema.safeParseAsync({
      email,
      password,
    });
    if (!validation.success) {
      const { errors } = validation.error;
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    //Because we have oauth accounts that dont use password and password is optional, we have to force typescript into accepting that
    //password will be always available because we using this login route only for users with password
    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({ email: user.email, name: user.name });
  } catch (err) {
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
