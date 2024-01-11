import Response from "../../utils/Response.js";
import { usernames } from "../../utils/username.js";
function generateRandomUsernameWithNumber() {
  const randomIndex = Math.floor(Math.random() * usernames.length);
  const selectedUsername = usernames[randomIndex];
  const randomNumber = Math.floor(Math.random() * 99999);

  return `${selectedUsername}${randomNumber}`;
}
export const generateUsername = async (req, res) => {
  try {
    // Example: Generate 10 random usernames with numbers
    const randomGeneratedUsernames = generateRandomUsernameWithNumber();
    Response(res, true, "username generated", 200, randomGeneratedUsernames);
    return;
  } catch (error) {
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
