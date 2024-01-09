import { NextResponse } from "next/server";
import { secureNotes } from "../../../../../../model/secureNotes";
import { user as User } from "../../../../../../model/user";
import { connectDB } from "../../../../../../utils/dbconnect";
import bcrypt from "bcrypt";
import CryptoJS from "crypto-js";
export const POST = async (req, { params }) => {
  try {
    await connectDB();
    const { vaultPin } = await req.json();
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
    } else if (!vaultPin || vaultPin.toString().length !== 6) {
      return NextResponse.json(
        { success: false, message: "Enter a 6-digit number vault pin" },
        { status: 422 }
      );
    }
    const note = await secureNotes.findById(params.id);
    if (!note) {
      return NextResponse.json(
        { success: false, message: "Note not found" },
        { status: 404 }
      );
    } else if (!(await bcrypt.compare(vaultPin, user.vaultPin))) {
      return NextResponse.json(
        { success: false, message: "Vault pin is incorrect" },
        { status: 402 }
      );
    }
    const decryptedNote = CryptoJS.AES.decrypt(note.notes, vaultPin).toString(
      CryptoJS.enc.Utf8
    );
    return NextResponse.json(
      {
        success: true,
        data: decryptedNote,
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
