import { NextResponse } from "next/server";
import { scores } from "@/lib/scores";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    stocks_loaded: scores.length,
  });
}
