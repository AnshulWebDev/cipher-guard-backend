import { NextResponse } from "next/server";
import { usernames } from "./username";
function generateRandomUsernameWithNumber() {
  const randomIndex = Math.floor(Math.random() * usernames.length);
  const selectedUsername = usernames[randomIndex];
  const randomNumber = Math.floor(Math.random() * 99999);

  return `${selectedUsername}${randomNumber}`;
}
export const GET = async () => {
  try {
    // Example: Generate 10 random usernames with numbers
    const randomGeneratedUsernames = generateRandomUsernameWithNumber();
    return NextResponse.json(
      { success: true, message: "username generated", data: randomGeneratedUsernames },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error Try Again" },
      { status: 500 }
    );
  }
};
