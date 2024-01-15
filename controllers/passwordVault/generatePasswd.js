const uniquepasswd = require("../../models/uniquepasswd.js");
const Response = require("../../utils/Response.js");

const uniquePassWdGenerator = (options, length) => {
  let result = "";
  const capital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const small = "abcdefghijklmnopqrstuvwxyz";
  const specialChar = "!@#$%^&*";
  const number = "0123456789";
  const passwdLength = length;

  const passwdGenerateType = options.split("+");
  const characters = passwdGenerateType.reduce((accumulator, type) => {
    switch (type) {
      case "capital":
        return accumulator + capital;
      case "small":
        return accumulator + small;
      case "special":
        return accumulator + specialChar;
      case "number":
        return accumulator + number;
      default:
        return accumulator;
    }
  }, "");

  for (let i = 0; i < passwdLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

exports.generatePasswd = async (req, res) => {
  try {
    const { capital, small, special, number, length } = req.body;
    if (!capital && !small && !special && !number) {
      Response(res, false, "Choose at least one option", 422);
      return;
    } else if (typeof length !== "number") {
      Response(res, false, "Choose a valid password length", 422);
      return;
    } else if (
      capital !== "capital" &&
      small !== "small" &&
      special !== "special" &&
      number !== "number"
    ) {
      Response(res, false, "Choose a correct password type", 422);
      return;
    } else if (length < 5 || length > 128) {
      Response(res, false, "Length should be between 5 to 128", 422);
      return;
    }

    const passwdDB = await uniquepasswd.find();
    let generatedPassword;
    do {
      generatedPassword = uniquePassWdGenerator(
        `${capital}+${small}+${special}+${number}`,
        length
      );
    } while (passwdDB.some((entry) => entry.passwd === generatedPassword));

    const newUniquePasswordEntry = new uniquepasswd({
      passwd: generatedPassword,
    });

    await newUniquePasswordEntry.save();
    Response(res, true, "password generated", 200, generatedPassword);
    return;
  } catch (error) {
    console.log(error.message);
    Response(res, false, "Internal server error Try Again", 500);
    return;
  }
};
