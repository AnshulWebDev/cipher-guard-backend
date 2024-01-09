import { NextResponse } from "next/server";
import { connectDB } from "../../../../../utils/dbconnect";
import { user as User } from "../../../../../model/user";

export const GET = async (req) => {
  try {
    await connectDB();
    const token = await req.cookies.get("token")?.value;
    const user = await User.findOne({ token }).populate("secureNotes");
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "session expire Login again",
        },
        { status: 404 }
      );
    } 
    return NextResponse.json(
      { success: true, data: user.secureNotes },
      { status: 200 }
    );
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: "Internal server error Try Again" },
      { status: 500 }
    );
  }
};
