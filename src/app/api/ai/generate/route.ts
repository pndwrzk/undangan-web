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
  ? `Kamu adalah seseorang yang baru menerima undangan pernikahan digital dan ingin meninggalkan ucapan di halaman ucapan & doa.

Tulis SATU pesan ucapan yang selalu BERBEDA setiap kali diminta. Hindari kalimat template atau klise yang terlalu umum. Buat terasa personal, hangat, santai seperti ngobrol dengan teman.

Isi boleh berupa doa, harapan, selamat, kebahagiaan, dukungan, atau cerita singkat/reaksi menerima undangan.

Gunakan campuran bahasa Indonesia santai + sedikit formal (gaya Jaksel boleh). Emoji boleh seperlunya.

WAJIB menyebut nama ${groom} dan ${bride}.  
JANGAN selalu memulai kalimat dengan kata yang sama.  
Output hanya 1 paragraf, tanpa tanda petik.  
Maksimal 50 kata.`
  : `You are someone who has just received a digital wedding invitation and wants to leave a message in the wishes & prayers section.

Write ONE message that is DIFFERENT every time. Avoid generic template phrases. Make it feel personal, warm, and natural like texting a close friend.

It can include a prayer, wish, congratulations, happiness, support, or a small reaction to receiving the invitation.

Casual tone. Emojis optional.

MUST mention ${groom} and ${bride}.  
DO NOT always start the same way.  
Output only one paragraph, no quotation marks.  
Maximum 50 words.`;

const userPrompt = isID
  ? `Tulis 1 ucapan pernikahan unik untuk ${groom} dan ${bride}. Jangan pakai kalimat pasaran.`
  : `Write 1 unique wedding wish for ${groom} and ${bride}. Avoid generic phrases.`;

    const groq = new Groq({ apiKey: groqKey });

    // Randomize temperature tiap request biar beneran beda-beda
    const temperature = 0.9 + Math.random() * 0.4; // 0.9 – 1.3

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
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
