import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCsrfForRoute } from "@/lib/csrf-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const csrfError = await validateCsrfForRoute(request);
  if (csrfError) return csrfError;

  try {
    const { language } = await request.json();
    const isID = language === "id";

    const couple = await prisma.couple.findFirst();
    const groom = couple?.groomAlias || couple?.groomName || (isID ? "Mempelai Pria" : "The Groom");
    const bride = couple?.brideAlias || couple?.brideName || (isID ? "Mempelai Wanita" : "The Bride");

    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json(
        { error: "Missing API Key", message: "Konfigurasi server belum lengkap." },
        { status: 500 }
      );
    }

    const systemPrompt = isID
      ? `Kamu adalah tamu di pernikahan yang lagi nulis ucapan di buku tamu digital. Tulis ucapan yang BERBEDA-BEDA setiap kali, natural, santai kayak ngobrol sama teman. Boleh doa, harapan, selamat, atau ekspresi kebahagiaan — bebas variasi. Pakai campuran bahasa gaul (bahasa jaksel) dan boleh bahasa Indonesia formal sesekali. Boleh emoji. WAJIB sebut nama ${groom} dan ${bride}. JANGAN mulai dengan kata yang sama terus. Maksimal 50 kata, tanpa tanda petik.`
      : `You are a wedding guest writing in a digital guestbook. Write something DIFFERENT every time — natural, casual, like texting a close friend. Can be a prayer, a wish, congrats, excitement, or love — mix it up! Use casual language. Emojis are welcome. MUST mention ${groom} and ${bride}. DON'T always start the same way. Max 50 words, no quotes.`;

    const userPrompt = isID
      ? `Tulis satu ucapan pernikahan untuk ${groom} dan ${bride}. Buat yang beda dari biasanya!`
      : `Write one wedding wish for ${groom} and ${bride}. Make it unique!`;

    const groq = new Groq({ apiKey: groqKey });

    // Randomize temperature tiap request biar beneran beda-beda
    const temperature = 0.9 + Math.random() * 0.4; // 0.9 – 1.3

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.1-8b-instant",
      temperature,
      max_completion_tokens: 150,
      top_p: 0.95,
      frequency_penalty: 0.8,
      presence_penalty: 0.6,
      stream: false,
    });

    const text = (completion.choices[0]?.message?.content || "").trim().replace(/^["']|["']$/g, "");

    if (!text) {
      return NextResponse.json(
        { error: "Empty Response", message: "Coba lagi ya, gagal generate ucapan." },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("AI Route Error:", error);
    return NextResponse.json(
      { error: "Server Error", message: "Gagal generate ucapan. Coba lagi nanti." },
      { status: 500 }
    );
  }
}
