import { Groq } from "groq-sdk";
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
      ? `Buatkan satu ucapan selamat menikah atau doa pendek yang manis, santai, dan ceria untuk ${groom} dan ${bride}. Pastikan untuk MENYEBUTKAN NAMA ${groom} dan ${bride} dalam ucapannya. Perbolehkan menggunakan emoji/emoticon secukupnya 😊. PENTING: JANGAN PERNAH membungkus teks dengan tanda petik di awal atau akhir. Jika perlu kutipan di tengah kalimat silakan, tapi dilarang keras ada tanda petik di paling awal atau paling akhir teks. Maksimal 100 karakter.`
      : `Generate one short, sweet, casual, and cheerful wedding wish for ${groom} and ${bride}. Make sure to MENTION THE NAMES of ${groom} and ${bride} in the wish. You may use emojis/emoticons 😊. IMPORTANT: NEVER wrap the text with quotation marks at the start or end. Quotes inside the sentence are fine if needed, but forbidden at the absolute start or end. Max 100 characters.`;

    // GROQ AI (Primary)
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json(
        { error: "Groq API Key Missing", message: "Gagal membuat ucapan. Silakan hubungi admin." },
        { status: 500 }
      );
    }

    try {
      const groq = new Groq({ apiKey: groqKey });
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.1-8b-instant",
        temperature: 0.6,
        max_completion_tokens: 1024,
        top_p: 0.95,
        stream: false
      });
      const text = (chatCompletion.choices[0]?.message?.content || "").trim();
      if (text) return NextResponse.json({ text });
      
      throw new Error("Empty response from Groq");
    } catch (err: any) {
      console.error("Groq Error:", err.message);
      return NextResponse.json(
        { error: "Groq Provider Error", message: "Gagal membuat ucapan. Silakan coba lagi nanti." },
        { status: 503 }
      );
    }

  } catch (error: any) {
    console.error("Critical AI Route Error:", error);
    return NextResponse.json(
      { error: "Critical Error", message: "Gagal membuat ucapan. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
