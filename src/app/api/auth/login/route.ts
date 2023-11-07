import { db } from "@/db";
import { users } from "@/db/schema";
import { LoginSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
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

    const user = (
      await db.select().from(users).where(eq(users.email, email))
    )[0];

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    return NextResponse.json({ email: user.email });
  } catch (err) {
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
