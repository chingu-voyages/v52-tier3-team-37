
import { NextResponse } from "next/server";

//TODO This is just for test. Remove this file
export async function GET() {
  return NextResponse.json({ message: "Hello from the API!" });
}
