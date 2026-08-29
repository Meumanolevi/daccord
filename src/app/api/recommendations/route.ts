import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(
    {
      status: "planned",
      service: "product-recommendations",
      message: "Contrato reservado para catálogo, compatibilidade e justificativas da curadoria.",
    },
    { status: 501 },
  );
}
