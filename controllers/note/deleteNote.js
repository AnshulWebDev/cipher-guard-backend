import { NextResponse } from "next/server";
import { user as User } from "../../../../../../model/user";
import { connectDB } from "../../../../../../utils/dbconnect";
import { secureNotes } from "../../../../../../model/secureNotes";
export const DELETE = async (req, { params }) => {
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
    try {
      await secureNotes.findByIdAndDelete(params.id);
      await User.updateOne(
        { _id: user._id },
        {
          $pull: { secureNotes: params.id },
        },
        { new: true }
      );

      return NextResponse.json(
        { success: true, message: "note delete successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { success: false, message: "Unable to delete item" },
        { status: 200 }
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
