import { NextResponse } from "next/server";
import { user as User } from "../../../../../model/user";
import { connectDB } from "../../../../../utils/dbconnect";

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
    const favoriteNotes = user.secureNotes.filter((note) => note.favorite);
    return NextResponse.json(
      { success: true, data: favoriteNotes },
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
