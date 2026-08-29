import { NextResponse } from "next/server";
import type { ApiStatus } from "@/types/api";

export function GET() {
  const response: ApiStatus = {
    status: "ok",
    service: "daccord-web",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
