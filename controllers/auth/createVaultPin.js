import { NextResponse } from "next/server";
import { connectDB } from "../../../../utils/dbconnect";
import { user as User } from "../../../../model/user";
import bcrypt from "bcrypt";
export const POST = async (req) => {
  try {
    await connectDB();
    const { vaultPin } = await req.json();
    const token = await req.cookies.get("token")?.value;
    if (vaultPin.toString().length !== 6) {
      return NextResponse.json(
        { success: false, message: "Enter a 6-digit number" },
        { status: 422 }
      );
    }
    const user = await User.findOne({ token });
    if (!user._id) {
      return NextResponse.redirect("/login");
    } else if (user.vaultPin) {
      return NextResponse.json(
        { success: true, message: "vault pin already created" },
        { status: 422 }
      );
    }
    const hashVaultPin = await bcrypt.hash(vaultPin, 12);
    user.vaultPin = hashVaultPin;
    await user.save();
    return NextResponse.json(
      { success: true, message: "pin created successfully" },
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
