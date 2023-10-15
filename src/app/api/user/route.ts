import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, userName, password } = body;

    const existingUserByEmail = await db.user.findUnique({
      where: { email: email },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "email already exists" },
        { status: 409 }
      );
    }

    const existingUserByUserName = await db.user.findUnique({
      where: { userName: userName },
    });
    if (existingUserByEmail) {
      return NextResponse.json(
        { user: null, message: "userName already exists " },
        { status: 409 }
      );
    }
    const hashPassword = await hash(password, 10);
    const newUser = await db.user.create({
      data: {
        email,
        userName,
        password: hashPassword,
      },
    });
    const { password: newUserPassword, ...rest } = newUser;

    return NextResponse.json(
      { user: newUser, message: "user created successfully " },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: "FUCK " }, { status: 500 });
  }
}
