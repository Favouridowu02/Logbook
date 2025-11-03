import { NextRequest, NextResponse } from "next/server";
import { buildPrompt, type LogbookPayload } from "@/lib/generateLogbook";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { inputs: LogbookPayload; model?: string };
    if (!body?.inputs || !body.inputs.description || !body.inputs.startDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Sanitize API key to avoid stray quotes/whitespace
    const rawKey = process.env.GROQ_API_KEY;
    const GROQ_API_KEY = rawKey ? rawKey.replace(/^['"]|['"]$/g, "").trim() : "";
    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: "Server not configured: missing GROQ_API_KEY. Get one free at https://console.groq.com" }, { status: 500 });
    }

    // Sanitize model name to avoid stray quotes/whitespace from env files
    const rawModel = body.model || process.env.GROQ_MODEL || "llama-3.1-8b-instant";
    const model = rawModel.replace(/^['"]|['"]$/g, "").trim();
    const prompt = buildPrompt(body.inputs);

    const url = `https://api.groq.com/openai/v1/chat/completions`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: "You are an expert technical writer who creates professional, top 1% quality engineering logbook entries.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
        top_p: 0.95,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: `Groq API error: ${res.status} ${text}`, model, url }, { status: 502 });
    }

    const data = await res.json();
    const text: string | undefined = data?.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json({ error: "No text generated", data }, { status: 500 });
    }

    return NextResponse.json({ text });
  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}
