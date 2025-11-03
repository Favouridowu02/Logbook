import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { description, entryType } = body;

    if (!description) {
      return NextResponse.json({ error: "Missing description" }, { status: 400 });
    }

    // Create a concise image prompt from the logbook description
    const imagePrompt = createImagePrompt(description, entryType);

    // Using Pollinations.ai - completely free, no API key needed
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=1024&height=1024&model=flux&nologo=true`;

    // Alternative: Use Hugging Face if GROQ_API_KEY is available (same key works)
    // const GROQ_API_KEY = process.env.GROQ_API_KEY?.replace(/^['"]|['"]$/g, "").trim();
    // if (GROQ_API_KEY) {
    //   return await generateWithHuggingFace(imagePrompt, GROQ_API_KEY);
    // }

    return NextResponse.json({ 
      imageUrl,
      prompt: imagePrompt 
    });

  } catch (e: any) {
    return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
  }
}

function createImagePrompt(description: string, entryType?: string): string {
  // Extract key technical terms and concepts
  const keywords = description
    .toLowerCase()
    .match(/\b(electromagnetic|propulsion|rocket|machine learning|neural network|algorithm|database|api|software|hardware|circuit|simulation|model|analysis|development|engineering|design|testing|prototype|system|code|programming|data|research|experiment)\b/g) || [];

  const uniqueKeywords = [...new Set(keywords)].slice(0, 5).join(", ");

  // Create a professional, technical illustration prompt
  const basePrompt = `Professional technical illustration of ${uniqueKeywords || "engineering project"}, clean modern design, blueprint style, technical diagrams, engineering schematics, high quality, detailed, minimalist, professional lighting, white background, isometric view`;

  return basePrompt;
}

// Alternative function using Hugging Face Inference API
async function generateWithHuggingFace(prompt: string, apiKey: string) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: prompt }),
    }
  );

  if (!response.ok) {
    throw new Error(`Hugging Face API error: ${response.status}`);
  }

  const blob = await response.blob();
  const buffer = Buffer.from(await blob.arrayBuffer());
  const base64 = buffer.toString('base64');
  
  return NextResponse.json({
    imageUrl: `data:image/png;base64,${base64}`,
    prompt
  });
}
