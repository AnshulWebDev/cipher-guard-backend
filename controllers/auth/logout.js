import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const response = NextResponse.json(
      {
        success: true,
        messahe: "Logout successfully",
      },
      { status: 200 }
    );
    response.cookies.delete("token");
    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error Try Again" },
      { status: 500 }
    );
  }
};
