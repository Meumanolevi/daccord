import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      status: "planned",
      service: "skin-analysis",
      message: "Contrato reservado. Conecte o provedor de análise e o fluxo de consentimento antes de ativar.",
      expectedInput: {
        image: "multipart/form-data",
        consent: true,
        profileId: "string opcional",
      },
    },
    { status: 501 },
  );
}
