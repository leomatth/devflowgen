import { NextResponse } from "next/server";
import {
  generateLandingFromPayload,
  landingGenerationSchema,
} from "../../../lib/ai/generation.ts";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = landingGenerationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const output = await generateLandingFromPayload(parsed.data);

    return NextResponse.json(output, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
