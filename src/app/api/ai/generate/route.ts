import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { language } = await request.json();
    const isID = language === "id";
    const couple = await prisma.couple.findFirst();
    const groom = couple?.groomAlias || couple?.groomName || (isID ? "Mempelai Pria" : "The Groom");
    const bride = couple?.brideAlias || couple?.brideName || (isID ? "Mempelai Wanita" : "The Bride");

    const prompt = isID 
      ? `Buatkan satu ucapan selamat menikah atau doa pendek yang manis, santai, dan ceria untuk ${groom} dan ${bride}. Pastikan untuk MENYEBUTKAN NAMA ${groom} dan ${bride} dalam ucapannya. Perbolehkan menggunakan emoji/emoticon secukupnya 😊. Berikan hanya teks ucapannya saja tanpa tanda petik, maksimal 100 karakter.`
      : `Generate one short, sweet, casual, and cheerful wedding wish for ${groom} and ${bride}. Make sure to MENTION THE NAMES of ${groom} and ${bride} in the wish. You may use emojis/emoticons 😊. Provide only the message text without quotes, max 100 characters.`;

    let text = "";

    // TIER 1: OpenAI
    const openAIKey = process.env.OPENAI_API_KEY;
    if (openAIKey) {
      try {
        const openai = new OpenAI({ apiKey: openAIKey });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 80,
        });
        text = completion.choices[0]?.message?.content?.trim() || "";
        if (text) return NextResponse.json({ text });
      } catch (err: any) {
        console.error("OpenAI Error:", err.message);
      }
    }

    // TIER 2: Gemini (Multi-model fallback)
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.0-flash-lite"];
      
      for (const modelName of models) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          text = result.response.text().trim();
          if (text) return NextResponse.json({ text });
        } catch (err: any) {
          console.error(`Gemini Error with ${modelName}:`, err.message);
        }
      }
    }

    // If both fail and no fallback is desired
    return NextResponse.json(
      { error: "AI Providers Unavailable", message: "Gagal membuat ucapan. Silakan coba lagi nanti." },
      { status: 503 }
    );

  } catch (error: any) {
    console.error("Critical AI Route Error:", error);
    return NextResponse.json(
      { error: "Critical Error", message: "Gagal membuat ucapan. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
