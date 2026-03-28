import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { language } = await request.json();
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("Gemini API Key present:", !!apiKey);

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      return NextResponse.json(
        { error: "Gemini API Key is not configured" },
        { status: 500 }
      );
    }

    // Fetch couple names from DB
    const couple = await prisma.couple.findFirst();
    const groom = couple?.groomAlias || couple?.groomName || "Mempelai Pria";
    const bride = couple?.brideAlias || couple?.brideName || "Mempelai Wanita";

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Attempt multiple models in case of quota or availability issues
    const models = ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash", "gemini-2.0-flash"];
    let lastError: any = null;
    let text = "";

    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = language === "id" 
          ? `Buatkan satu ucapan selamat menikah atau doa pendek yang manis dan santai (tidak terlalu formal) untuk ${groom} dan ${bride}. Ucapannya harus singkat, hangat, dan asik dibaca di buku tamu. Berikan hanya teks ucapannya saja tanpa tanda petik, maksimal 100 karakter.`
          : `Generate one short, sweet, and casual (not too formal) wedding wish or prayer for ${groom} and ${bride}. The message should be concise, warm, and fun to read in a guestbook. Provide only the message text without quotes, maximum 100 characters.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        text = response.text().trim();
        if (text) break; // Success!
      } catch (err: any) {
        lastError = err;
        console.error(`Gemini Error with ${modelName}:`, err.message);
        continue;
      }
    }

    if (!text && lastError) {
      throw lastError;
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate wish", 
        message: error.message,
        status: error.status 
      },
      { status: 500 }
    );
  }
}
