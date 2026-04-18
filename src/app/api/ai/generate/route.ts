import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCsrfForRoute } from "@/lib/csrf-validation";

export const runtime = "nodejs";

// Template variasi untuk berbagai jenis pesan tamu undangan
const getVariedPrompt = (groom: string, bride: string, isID: boolean, variation: number) => {
  if (isID) {
    const templates = [
      `Buatkan ucapan doa dan harapan baik untuk ${groom} dan ${bride}. Gaya santai seperti teman yang memberikan blessing. Pakai bahasa gaul "gue doain", "semoga", "moga-moga". Fokus pada doa dan harapan tanpa menyebutkan kehadiran. Sertakan nama kedua mempelai. Boleh emoji 💕. Tanpa petik. Max 100 karakter.`,
      
      `Ciptakan pesan support dan encouragement untuk ${groom} dan ${bride}. Gaya chatting excited, pakai "kalian keren", "perfect match", "so happy for you". Ekspresikan kebahagiaan untuk mereka tanpa mention attendance. Nama keduanya wajib ada. Emoji ✨ boleh. Tanpa kutip. Max 100 karakter.`,
      
      `Susun ucapan selamat yang warm dan heartfelt untuk ${groom} dan ${bride}. Gaya anak muda yang supportive, pakai "congrats", "bahagia banget", "love you guys". Fokus pada celebration dan joy. Sebut nama mereka. Emoji 🎉 diperbolehkan. Tanpa petik. Max 100 karakter.`,
      
      `Rangkai kata-kata appreciation dan love untuk ${groom} dan ${bride}. Pakai "gue sayang kalian", "proud of you", "deserve happiness". Warm tapi casual, ekspresikan affection dan pride. Nama wajib disebutkan. Emoji 💖 oke. Tanpa kutip. Max 100 karakter.`,
      
      `Formulasikan pesan blessing dan well wishes untuk ${groom} dan ${bride}. Gaya santai tapi meaningful, pakai "blessed banget", "Allah berkahi", "so grateful". Mix spiritual dan casual. Kedua nama harus ada. Emoji 🌸 boleh. Tanpa petik. Max 100 karakter.`
    ];
    return templates[variation % templates.length];
  } else {
    const templates = [
      `Create a prayer and blessing message for ${groom} and ${bride}. Casual style like a friend giving blessings. Use friendly language "praying for you", "wishing you", "hope you guys". Focus on prayers and hopes without mentioning attendance. Include both names. Emojis allowed 💕. No quotes. Max 100 characters.`,
      
      `Craft a supportive and encouraging message for ${groom} and ${bride}. Excited chatting style, use "you guys are amazing", "perfect match", "so happy for you". Express happiness for them without mentioning attendance. Both names required. Emojis ✨ permitted. No quotes. Max 100 characters.`,
      
      `Compose a warm and heartfelt congratulations for ${groom} and ${bride}. Young, supportive style, use "congrats", "so happy", "love you guys". Focus on celebration and joy. Mention their names. Emojis 🎉 welcome. No quotes. Max 100 characters.`,
      
      `Write words of appreciation and love for ${groom} and ${bride}. Use "love you both", "proud of you", "deserve all happiness". Warm but relaxed, express affection and pride. Names must be mentioned. Emojis 💖 okay. No quotes. Max 100 characters.`,
      
      `Formulate a blessing and well wishes message for ${groom} and ${bride}. Casual but meaningful style, use "blessed", "God bless", "so grateful for you". Mix spiritual and casual. Both names required. Emojis 🌸 allowed. No quotes. Max 100 characters.`
    ];
    return templates[variation % templates.length];
  }
};

// Fungsi untuk memproses dan memvariasikan response untuk berbagai jenis pesan tamu
const postProcessResponse = (text: string, isID: boolean, variation: number): string => {
  if (!text) return text;
  
  // Hapus tanda petik di awal dan akhir jika ada
  let processed = text.replace(/^["']|["']$/g, '');
  
  if (isID) {
    // Variasi kata-kata untuk berbagai jenis pesan tamu undangan
    const wordVariations: { [key: string]: string[] } = {
      'selamat': ['selamat', 'congrats', 'happy wedding', 'turut bahagia', 'ikut seneng'],
      'bahagia': ['bahagia', 'happy banget', 'seneng', 'gembira', 'excited'],
      'semoga': ['semoga', 'mudah-mudahan', 'gue doain', 'hope', 'moga-moga'],
      'doa': ['doa', 'prayers', 'doa terbaik', 'blessing', 'harapan'],
      'kalian': ['kalian', 'lo berdua', 'you guys', 'kalian berdua', 'lo'],
      'langgeng': ['langgeng', 'awet', 'forever', 'selamanya', 'lasting'],
      'cinta': ['cinta', 'love', 'sayang', 'kasih sayang', 'affection'],
      'indah': ['indah', 'beautiful', 'sweet', 'cantik', 'amazing'],
      'berkah': ['berkah', 'blessed', 'penuh berkah', 'barokah', 'grace'],
      'terbaik': ['terbaik', 'the best', 'amazing', 'wonderful', 'fantastic'],
      'perfect': ['perfect', 'cocok banget', 'ideal', 'meant to be', 'so right'],
      'proud': ['proud', 'bangga', 'happy for you', 'seneng liat kalian', 'so proud'],
      'deserve': ['deserve', 'pantas', 'layak', 'worth it', 'berhak'],
      'grateful': ['grateful', 'bersyukur', 'thankful', 'appreciate', 'blessed'],
      'kamu': ['kamu', 'lo', 'kalian', 'you', 'lu'],
      'saya': ['saya', 'gue', 'aku', 'I', 'gw'],
      'sangat': ['sangat', 'banget', 'very', 'super', 'really']
    };
    
    // Terapkan variasi berdasarkan variation number
    Object.keys(wordVariations).forEach(key => {
      const variations = wordVariations[key];
      const selectedVariation = variations[variation % variations.length];
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      processed = processed.replace(regex, selectedVariation);
    });
  } else {
    // Variasi kata-kata untuk berbagai jenis pesan dalam bahasa Inggris
    const wordVariations: { [key: string]: string[] } = {
      'congratulations': ['congratulations', 'congrats', 'best wishes', 'happy for you', 'cheers'],
      'happy': ['happy', 'thrilled', 'excited', 'delighted', 'overjoyed'],
      'love': ['love', 'adore', 'care about', 'cherish', 'appreciate'],
      'beautiful': ['beautiful', 'gorgeous', 'lovely', 'amazing', 'wonderful'],
      'blessed': ['blessed', 'fortunate', 'lucky', 'graced', 'favored'],
      'perfect': ['perfect', 'ideal', 'meant to be', 'so right', 'amazing'],
      'proud': ['proud', 'so proud', 'happy for you', 'thrilled for you', 'excited for you'],
      'deserve': ['deserve', 'worthy of', 'earned', 'meant for', 'should have'],
      'grateful': ['grateful', 'thankful', 'blessed', 'appreciative', 'so glad'],
      'wishes': ['wishes', 'prayers', 'hopes', 'blessings', 'good vibes'],
      'wonderful': ['wonderful', 'amazing', 'fantastic', 'incredible', 'awesome'],
      'you': ['you', 'you guys', 'you two', 'both of you', 'y\'all'],
      'very': ['very', 'so', 'super', 'really', 'totally']
    };
    
    // Terapkan variasi berdasarkan variation number
    Object.keys(wordVariations).forEach(key => {
      const variations = wordVariations[key];
      const selectedVariation = variations[variation % variations.length];
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      processed = processed.replace(regex, selectedVariation);
    });
  }
  
  return processed;
};

// Fungsi untuk menghitung similarity sederhana antara dua string
const calculateSimilarity = (str1: string, str2: string): number => {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
};

export async function POST(request: Request) {
  // Validate CSRF
  const csrfError = await validateCsrfForRoute(request);
  if (csrfError) return csrfError;

  try {
    const { language } = await request.json();
    const isID = language === "id";
    const couple = await prisma.couple.findFirst();
    const groom = couple?.groomAlias || couple?.groomName || (isID ? "Mempelai Pria" : "The Groom");
    const bride = couple?.brideAlias || couple?.brideName || (isID ? "Mempelai Wanita" : "The Bride");

    // Gunakan variasi berdasarkan timestamp dan random untuk memastikan keberagaman
    const baseVariation = Math.floor(Date.now() / 1000) % 5;
    const randomFactor = Math.floor(Math.random() * 3);
    const variation = (baseVariation + randomFactor) % 5;
    
    const prompt = getVariedPrompt(groom, bride, isID, variation);

    // GROQ AI (Primary) dengan parameter yang bervariasi untuk keberagaman
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
      return NextResponse.json(
        { error: "Groq API Key Missing", message: "Gagal membuat ucapan. Silakan hubungi admin." },
        { status: 500 }
      );
    }

    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const groq = new Groq({ apiKey: groqKey });
        
        // Variasi parameter untuk menghasilkan response yang beragam
        const temperatureVariations = [0.7, 0.8, 0.9, 1.0, 1.1];
        const topPVariations = [0.85, 0.9, 0.95, 1.0];
        
        const temperature = temperatureVariations[(variation + attempts) % temperatureVariations.length];
        const topP = topPVariations[(variation + attempts) % topPVariations.length];
        
        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { 
              role: "system", 
              content: isID 
                ? "Kamu adalah tamu yang nulis pesan di website undangan. Bisa berbagai jenis: doa saja, ucapan selamat, dukungan, atau appreciation. JANGAN selalu mention kehadiran. Pakai bahasa gaul 'gue/lo', 'banget', 'keren sih'. Bisa fokus pada: blessing, congratulations, support, love, atau prayers. Natural, warm, dan bervariasi."
                : "You are a guest writing a message on a wedding website. Can be various types: prayers only, congratulations, support, or appreciation. DON'T always mention attendance. Use casual language 'you guys', 'so happy', 'amazing'. Can focus on: blessings, congratulations, support, love, or prayers. Natural, warm, and varied."
            },
            { role: "user", content: prompt }
          ],
          model: "llama-3.1-8b-instant",
          temperature: temperature,
          max_completion_tokens: 1024,
          top_p: topP,
          stream: false,
          // Tambahan untuk keberagaman
          frequency_penalty: 0.3 + (attempts * 0.1),
          presence_penalty: 0.2 + (attempts * 0.1)
        });
        
        const text = (chatCompletion.choices[0]?.message?.content || "").trim();
        
        // Post-processing untuk variasi kata dan frasa
        const processedText = postProcessResponse(text, isID, variation + attempts);
        
        if (processedText) {
          // Cek apakah response terlalu mirip dengan yang sudah ada (opsional)
          const recentMessages = await prisma.guestbook.findMany({
            where: {
              createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 jam terakhir
              }
            },
            select: { message: true },
            orderBy: { createdAt: 'desc' },
            take: 10
          });
          
          // Cek similarity sederhana
          const isSimilar = recentMessages.some(msg => 
            calculateSimilarity(processedText.toLowerCase(), msg.message.toLowerCase()) > 0.7
          );
          
          if (!isSimilar || attempts === maxAttempts - 1) {
            return NextResponse.json({ text: processedText });
          }
        }
        
        attempts++;
      } catch (err: any) {
        attempts++;
        if (attempts >= maxAttempts) {
          console.error("Groq Error:", err.message);
          return NextResponse.json(
            { error: "Groq Provider Error", message: "Gagal membuat ucapan. Silakan coba lagi nanti." },
            { status: 503 }
          );
        }
      }
    }
    
    throw new Error("Failed to generate unique response after multiple attempts");

  } catch (error: any) {
    console.error("Critical AI Route Error:", error);
    return NextResponse.json(
      { error: "Critical Error", message: "Gagal membuat ucapan. Silakan coba lagi nanti." },
      { status: 500 }
    );
  }
}
