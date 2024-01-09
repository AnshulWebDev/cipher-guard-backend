import { NextResponse } from "next/server";
import { connectDB } from "../../../../../utils/dbconnect";
import { user as User } from "../../../../../model/user";
import { secureNotes } from "../../../../../model/secureNotes";
import CryptoJS from "crypto-js";
import bcrypt from "bcrypt";
export const POST = async (req) => {
  try {
    await connectDB();
    const { name, note, favorite, vaultPin, lockNote } = await req.json();
    if (!name) {
      return NextResponse.json(
        { success: false, message: "enter note name" },
        { status: 422 }
      );
    } else if (!note) {
      return NextResponse.json(
        { success: false, message: "note will not be empty" },
        { status: 422 }
      );
    }
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
    const createNote = async (name, note, encrypt) => {
      const newNote = await secureNotes.create({
        name: name,
        notes: note,
        favorite: favorite ? true : false,
        encrypt: encrypt,
      });
      await User.findByIdAndUpdate(
        user._id,
        {
          $push: { secureNotes: newNote._id },
        },
        { new: true }
      );
    };
    if (lockNote === true) {
      if (!vaultPin || vaultPin.toString().length !== 6) {
        return NextResponse.json(
          { success: false, message: "Enter a 6-digit number vault pin" },
          { status: 422 }
        );
      } else if (!user.vaultPin) {
        return NextResponse.json(
          { success: false, message: "create 6 digit vault pin" },
          { status: 422 }
        );
      } else if (!(await bcrypt.compare(vaultPin, user.vaultPin))) {
        return NextResponse.json(
          { success: false, message: "Vault pin is incorrect" },
          { status: 402 }
        );
      }
      const encryptNote = await CryptoJS.AES.encrypt(note, vaultPin).toString();
      await createNote(name, encryptNote, true);
      return NextResponse.json(
        {
          success: true,
          message: "Note added successfully",
        },
        { status: 200 }
      );
    } else {
      await createNote(name, note, false);
      return NextResponse.json(
        {
          success: true,
          message: "Note added successfully",
        },
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
