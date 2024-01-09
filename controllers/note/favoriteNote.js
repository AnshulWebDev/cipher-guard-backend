import { NextResponse } from "next/server";
import { user as User } from "../../../../../../model/user";
import { connectDB } from "../../../../../../utils/dbconnect";
import { secureNotes } from "../../../../../../model/secureNotes";
export const PUT = async (req, { params }) => {
  try {
    await connectDB();
    const { favorite } = await req.json();
    const token = await req.cookies.get("token")?.value;
    const user = await User.findOne({ token });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "session expire Login again",
        },
        { status: 404 }
      );
    }
    const updateNotes = {};
    if (favorite === true || favorite === false) {
      updateNotes.favorite = favorite;
    }
    try {
      await secureNotes.findByIdAndUpdate(params.id, updateNotes, {
        new: true,
      });
      return NextResponse.json(
        { success: true, message: "Note updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Note not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.log(error.message);
    return NextResponse.json(
      { success: false, message: "Internal server error Try Again" },
      { status: 500 }
    );
  }
};
