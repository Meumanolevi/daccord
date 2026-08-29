import { NextResponse } from "next/server";
import { answerHelpQuestion, helpSuggestions } from "@/lib/help-assistant";
import type { HelpRequest, HelpResponse } from "@/types/api";

export function GET() {
  return NextResponse.json({
    channel: "daccord-assistant",
    status: "available",
    suggestions: helpSuggestions,
  });
}

export async function POST(request: Request) {
  let body: HelpRequest;

  try {
    body = (await request.json()) as HelpRequest;
  } catch {
    return NextResponse.json({ error: "Corpo JSON inválido." }, { status: 400 });
  }

  const message = body.message?.trim().slice(0, 500);

  if (!message) {
    return NextResponse.json({ error: "Escreva uma dúvida para o assistente." }, { status: 422 });
  }

  const response: HelpResponse = {
    channel: "daccord-assistant",
    reply: answerHelpQuestion(message),
    suggestions: [...helpSuggestions],
  };

  return NextResponse.json(response);
}
