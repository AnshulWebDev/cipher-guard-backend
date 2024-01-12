import { user } from "../../../models/user.js";
import Jwt from "jsonwebtoken";
import { otp as OTP } from "../../../models/otp.js";
import { mailSender } from "../../../utils/mailSender.js";
import Response from "../../../utils/Response.js";
import { nodeCache } from "../../../server.js";

export const verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    const cookiesValue =
      req.cookies.data.value ||
      req.header("Authorization").replace("Bearer ", "");
    if (!cookiesValue) {
      Response(res, false, "Please register first", 422);
      return;
    }
    const decode = Jwt.verify(cookiesValue, process.env.JWT_SECRET);
    if (!decode) {
      Response(res, false, "unable to verify", 401);
      return;
    }

    // console.log(decode);
    const recentOtp = await OTP.findOne({ email: decode.email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!recentOtp) {
      Response(res, false, "OTP not found. Try to resend otp", 400);
      return;
    }
    if (otp !== recentOtp.otp) {
      Response(res, false, "Invalid otp", 422);
      return;
    }
    try {
      await user.create({
        firstName: decode.firstName,
        lastName: decode.lastName,
        email: decode.email,
        isEmailVerify: true,
        password: decode.password,
        profileImg: `https://api.dicebear.com/7.x/fun-emoji/png?seed=${decode.firstName}`,
      });
      await mailSender(
        decode.email,
        "Welcome to CipherGuard",
        `<!DOCTYPE html>
        <html lang="en">
        
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to SecurePass Pro</title>
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
              background-color: #f4f4f4;
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
        
            ul {
              list-style-type: none;
              padding: 0;
            }
        
            ul li::before {
              content: "✓ ";
              color: #262626;
            }
        
            .footer {
              border-top: 2px solid #ccc;
              padding-top: 20px;
              margin-top: 20px;
            }
        
            /* Responsive Styles */
            @media screen and (max-width: 600px) {
              .container {
                padding: 15px;
              }
            }
          </style>
        </head>
        
        <body>
        
          <div class="container">
            <h1>${decode.firstName}, Welcome to CipherGuard!</h1>
            <p>You are now part of the CipherGuard family! Get ready to depart on an exciting journey with us!</p>
            <p>To make things extra special for you, starting today, we will send you a series of exclusive emails with
              amazing tips and tricks to get the most out of.</p>
            <p>Get ready!</p>
        
            <h2>Key Features:</h2>
            <ul>
              <li>Generate unique Passwords</li>
              <li>No forgot password policy</li>
              <li>Login Alert!</li>
              <li>Username Generator option</li>
              <li>Password Storage and Encryption</li>
              <li>Secure Notes</li>
              <li>After four unsuccessful password attempts, the account may be temporarily suspended for security purposes</li>
              <li>Emergency Access</li>
              <li>login alert (if user think there is suspicious login they can temporarily blocked their account)</li>
              <li>Vault password</li>
            </ul>
        
            <div class="footer">
              <p>Best,<br><a href="https://devglimpse.com" target="_blank">The CipherGuard team</a></p>
            </div>
          </div>
        
        </body>
        
        </html>
        `
      );
      nodeCache.del("allRegisterUser");
      return res.clearCookie("data").status(200).json({
        success: true,
        message: "Account create successfully",
      });
    } catch (error) {
      //check if user is already registered or not
      Response(res, false, "Email is already registered", 422);
      return;
    }
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
