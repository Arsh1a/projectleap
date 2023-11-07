import { db } from "@/db";
import { users } from "@/db/schema";
import { SignUpSchema } from "@/lib/validation";
import bcrypt from "bcryptjs";
import { eq, exists } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, fullName } = await req.json();

    //Validation
    const validation = await SignUpSchema.safeParseAsync({
      email,
      password,
      fullName,
    });
    if (!validation.success) {
      const { errors } = validation.error;
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const userExists = await db
      .select()
      .from(users)
      .where(exists(db.select().from(users).where(eq(users.email, email))));

    if (userExists.length > 0) {
      return NextResponse.json(
        { error: "User already exists." },
        { status: 400 }
      );
    }

    //Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    //Insert to DB
    await db.insert(users).values({
      email,
      password: hashedPassword,
      fullName,
    });

    return NextResponse.json({ email, password });
  } catch (err) {
    return NextResponse.json(
      { error: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
