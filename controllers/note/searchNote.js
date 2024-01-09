import { NextResponse } from "next/server";
import { user as User } from "../../../../../model/user";

export const GET = async (req) => {
  try {
    const token = await req.cookies.get("token")?.value;
    const url = new URL(req.url);
    const name = url.searchParams.get("name");
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
    const searchResult = user.secureNotes.filter((note) =>
      new RegExp(name, "i").test(note.name)
    );
    user.secureNotes;
    return NextResponse.json(
      {
        success: true,
        message: "Success",
        data: searchResult.length > 0 ? searchResult : "No result found",
      },
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
