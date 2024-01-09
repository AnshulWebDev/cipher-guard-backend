import { NextResponse } from "next/server";
import { uniquepasswd } from "../../../../../model/uniquepasswd";
import { connectDB } from "../../../../../utils/dbconnect";

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

export const POST = async (req) => {
  try {
    await connectDB();
    const { capital, small, special, number, length } = await req.json();
    if (!capital && !small && !special && !number) {
      return NextResponse.json(
        {
          success: false,
          message: "Choose at least one option",
        },
        { status: 422 }
      );
    } else if (typeof length !== "number") {
      return NextResponse.json(
        {
          success: false,
          message: "Choose a valid password length",
        },
        { status: 422 }
      );
    } else if (
      capital !== "capital" &&
      small !== "small" &&
      special !== "special" &&
      number !== "number"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Choose a correct password type",
        },
        { status: 422 }
      );
    } else if (length < 5 || length > 128) {
      return NextResponse.json(
        {
          success: false,
          message: "Length should be between 5 to 128",
        },
        { status: 422 }
      );
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
    return NextResponse.json(
      {
        success: true,
        message: "password generated",
        data: generatedPassword,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error Try Again" },
      { status: 500 }
    );
  }
};
