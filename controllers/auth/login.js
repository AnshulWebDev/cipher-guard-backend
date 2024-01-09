import { NextResponse } from "next/server";
import { user } from "../../../../model/user";
import { connectDB } from "../../../../utils/dbconnect";
import validator from "validator";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { mailSender } from "../../../../utils/mailSender";

export const POST = async (req) => {
  try {
    await connectDB();
    const { email, password } = await req.json();
    const users = await user.findOne({ email: email }).select("+password");
    if (!validator.isEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter valid email id.",
        },
        { status: 422 }
      );
    } else if (!users) {
      return NextResponse.json(
        {
          success: false,
          message: "user not found. Please register first",
        },
        { status: 404 }
      );
    } else if (users.accountLock) {
      return NextResponse.json(
        {
          success: false,
          message: "Your Accout is locked contact admin@devglimpse.com",
        },
        { status: 423 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, users.password);
    if (!isPasswordMatch) {
      // Check if lastAttemptTime is older than the current time
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      if (users.wrongPasswdAttempt.lastAttemptTime < thirtyMinutesAgo) {
        // Reset attempts to 0 and set lastAttemptTime to undefined
        users.wrongPasswdAttempt.attempts = 0;
        users.wrongPasswdAttempt.lastAttemptTime = undefined;
        await users.save();
      }
      if (
        users.wrongPasswdAttempt.attempts === 4 &&
        users.wrongPasswdAttempt.lastAttemptTime
      ) {
        users.accountLock = true;
        await users.save();
        return NextResponse.json(
          {
            success: false,
            message: "Your Accout is locked contact admin@devglimpse.com",
          },
          { status: 423 }
        );
      } else if (users.wrongPasswdAttempt.lastAttemptTime) {
        users.wrongPasswdAttempt.attempts += 1;
        await users.save();
        return NextResponse.json(
          {
            success: false,
            message: `wrong password you left ${users.wrongPasswdAttempt.attempts} out of 4`,
          },
          { status: 401 }
        );
      }
    } else {
      users.wrongPasswdAttempt.attempts *= 0;
      users.wrongPasswdAttempt.lastAttemptTime = undefined;
      await users.save();
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
      await mailSender(
        users.email,
        "Login from new device",
        `
        <!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Login Alert</title>
  <style>
    /* Add your styles here */
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #262626;
    }

    p {
      font-size: 16px;
      line-height: 1.5;
      color: #262626;
    }

    .alert {
      display: inline-block;
      padding: 8px 16px;
      font-size: 18px;
      font-weight: bold;
      background-color: #e74c3c;
      color: #fff;
      border-radius: 4px;
    }

    .footer {
      border-top: 2px solid #ccc;
      padding-top: 20px;
      margin-top: 20px;
    }
  </style>
</head>

<body>

  <div class="container">
    <h1>Login Alert</h1>
    <p>Dear ${users.firstName},</p>

    <p>We noticed a login to your account from a new device on ${currentDate}. If this was you, you can ignore this
      message. If you didn't log in, please take immediate action to secure your account.</p>

    <p>If you have any concerns or need assistance, please contact our support team.</p>

    <p class="alert">New Login Detected</p>

    <div class="footer">
      <p>Best,<br><a href="https://devglimpse.com" target="_blank">The CipherGuard team</a></p>
    </div>
  </div>

</body>

</html>

        `
      );
      const response = NextResponse.json(
        { success: true, message: `Welcome back ${users.firstName}` },
        { status: 200 }
      );
      const payload = {
        email: users.email,
        id: users._id,
      };
      const token = Jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "6h",
      });
      users.token = token;
      await users.save();
      response.cookies.set({
        name: "token",
        value: token,
        httpOnly: true,
        path: "/",
        maxAge: 11.5 * 60 * 60, // 6 hours expiry
      });
      return response;
    }
  } catch (error) {
    console.log(error);
    // if (error.message === "Unexpected end of JSON input") {
    //   return NextResponse.json(
    //     { success: false, message: "Data can't be empty" },
    //     { status: 406 }
    //   );
    // }
    return NextResponse.json(
      { success: false, message: "Internal server error Try Again" },
      { status: 500 }
    );
  }
};
