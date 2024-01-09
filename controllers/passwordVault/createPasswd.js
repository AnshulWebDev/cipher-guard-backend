import { user as User } from "../../models/user.js";
import { passwordvault } from "../../models/passwordVault.js";
import CryptoJS from "crypto-js";
export const POST = async (req) => {
  try {
    const { name, username, password, website, vaultPin } = await req.json();
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
    } else if (!name || !username || !password || !website) {
      return NextResponse.json(
        { success: false, message: "Enter all fields" },
        { status: 402 }
      );
    } else if (!vaultPin || vaultPin.toString().length !== 6) {
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
    const currentDate = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    const encryptPasswd = await CryptoJS.AES.encrypt(
      password,
      vaultPin
    ).toString();
    const newPassword = await passwordvault.create({
      name,
      username,
      password: encryptPasswd,
      website,
      Created: currentDate,
    });
    await User.findByIdAndUpdate(
      user._id,
      {
        $push: { passwordVault: newPassword._id },
      },
      { new: true }
    );
    return NextResponse.json(
      { success: true, message: "credential saved" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error Try Again" },
      { status: 500 }
    );
  }
};
