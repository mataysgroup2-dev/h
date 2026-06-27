// ============================================================
// AI (CLAUDE) YORDAMIDA KANAL POSTLARINI O'QISH
// ============================================================
// Kanal postlari erkin, turlicha formatda yozilgani uchun
// (har bir post boshqacha tuzilishda), oddiy shablon (regex)
// bilan o'qish ishonchli emas. Bu modul har bir post matnini
// Claude API'ga yuboradi, u postni "o'qib", tuzilgan
// ma'lumotga (JSON) aylantiradi.
// ============================================================

const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const TOURS_DB_FILE = path.join(__dirname, "tours_from_channel.json");

const client = ANTHROPIC_API_KEY ? new Anthropic({ apiKey: ANTHROPIC_API_KEY }) : null;

const SYSTEM_PROMPT = `Sen turizm e'lonlarini o'qib, tuzilgan JSON ma'lumotga aylantiruvchi yordamchisan.
Senga Telegram kanalidagi bitta tur paketi e'loni matni beriladi (o'zbek va rus tillari aralash bo'lishi mumkin).

Quyidagi JSON formatida javob ber, BOSHQA HECH NARSA YOZMA (faqat JSON, izohsiz):

{
  "is_valid_tour": true/false,
  "direction": "turkiya" | "baa" | "misr" | "tailand" | "vetnam" | "bali" | "maldiv" | "gruziya" | "saudiya" | "malayziya" | "shri_lanka" | "yevropa" | "boshqa",
  "title": "qisqa sarlavha (masalan: Istanbul + Trabzon)",
  "date_range": "sayohat sanasi matn ko'rinishida, masalan: 03.07.2026 - 10.07.2026, yoki null agar yo'q bo'lsa",
  "duration_text": "necha kun/tun matn ko'rinishida, masalan: 7 kun/6 tun, yoki null agar aniq aytilmagan bo'lsa",
  "hotels": ["mehmonxona nomi va yulduzi matn ko'rinishida, ro'yxat"],
  "price_usd": raqam (faqat son, $ belgisisiz) yoki null agar narx yo'q/noaniq bo'lsa,
  "price_note": "narx haqida qo'shimcha izoh (masalan: 1 kishiga, 2 kishilik xonada), yoki null",
  "includes": ["narxga kiradigan xizmatlar ro'yxati, qisqa qilib"],
  "summary_uz": "butun e'lonning 2-3 gapli o'zbekcha qisqa tavsifi, mijoz uchun chiroyli yozilgan",
  "summary_ru": "tot же tavsif rus tilida"
}

Agar matn umuman tur paketi e'loni bo'lmasa (masalan oddiy reklama, savol, boshqa mavzu), "is_valid_tour": false qaytar va boshqa maydonlarni null qoldir.

"direction" ni matndan aniqla, quyidagi kalit so'zlarga qarab:
- "turkiya": Turkiya, Istanbul, Antalya, Trabzon, Kusadasi, Bodrum, Alanya
- "baa": Dubay, BAA, Abu Dabi, Sharjah
- "misr": Misr, Sharm El Sheikh, Hurghada, Qohira
- "tailand": Tailand, Phuket, Pattaya, Bangkok, Phi Phi, Krabi
- "vetnam": Vetnam, Nha Trang, Da Nang, Phu Quoc, Hanoy
- "bali": Bali, Indoneziya, Ubud, Jakarta
- "maldiv": Maldiv, Maldives
- "gruziya": Gruziya, Tbilisi, Batumi, Kazbegi
- "saudiya": Saudiya, Umra, Haj, Makka, Madina, Jidda
- "malayziya": Malayziya, Kuala Lumpur, Langkavi
- "shri_lanka": Shri-Lanka, Kolombo
- "yevropa": Yevropadagi mamlakatlar (Italiya, Fransiya, Ispaniya, Germaniya va h.k.)
- Agar yuqoridagilarning hech biriga mos kelmasa: "boshqa"`;

async function parsePostWithAI(text) {
  if (!client) {
    throw new Error("ANTHROPIC_API_KEY .env faylida topilmadi");
  }

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: text }],
  });

  const rawText = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("");

  // Claude ba'zan ```json bilan o'rab yuborishi mumkin - tozalaymiz
  const cleaned = rawText.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    throw new Error(`AI javobini JSON sifatida o'qib bo'lmadi: ${cleaned.slice(0, 200)}`);
  }

  return parsed;
}

// ---------- SAQLASH ----------

function loadChannelTours() {
  if (!fs.existsSync(TOURS_DB_FILE)) {
    fs.writeFileSync(TOURS_DB_FILE, JSON.stringify([], null, 2));
  }
  try {
    return JSON.parse(fs.readFileSync(TOURS_DB_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveChannelTours(tours) {
  fs.writeFileSync(TOURS_DB_FILE, JSON.stringify(tours, null, 2));
}

// Sarlavhani solishtirish uchun tozalaymiz (katta-kichik harf,
// bo'sh joylar farq qilmasligi uchun)
function normalizeTitle(title) {
  return (title || "").toLowerCase().trim().replace(/\s+/g, " ");
}

function addAITourToDB(aiResult, { photoFileId, sourceMessageId } = {}) {
  const tours = loadChannelTours();

  const newTour = {
    id: `tour_${sourceMessageId || Date.now()}`,
    direction: aiResult.direction || "boshqa",
    title: aiResult.title || "Tur paketi",
    date_range: aiResult.date_range || null,
    duration_text: aiResult.duration_text || null,
    hotels: aiResult.hotels || [],
    price_usd: aiResult.price_usd || null,
    price_note: aiResult.price_note || null,
    includes: aiResult.includes || [],
    summary_uz: aiResult.summary_uz || "",
    summary_ru: aiResult.summary_ru || "",
    photoFileId: photoFileId || null,
    updatedAt: new Date().toISOString(),
  };

  // Agar bir xil sarlavha (title) bilan eski tur mavjud bo'lsa,
  // uni o'chirib, yangisini qo'shamiz (narx/ma'lumot yangilanishi
  // sifatida hisoblanadi, eski-yangi ikkisi birga turib qolmaydi).
  const normalizedNewTitle = normalizeTitle(newTour.title);
  const filtered = tours.filter((t) => normalizeTitle(t.title) !== normalizedNewTitle);
  const wasReplaced = filtered.length < tours.length;

  filtered.push(newTour);
  saveChannelTours(filtered);

  return { ...newTour, wasReplaced };
}

function getAllAITours() {
  return loadChannelTours();
}

module.exports = { parsePostWithAI, addAITourToDB, getAllAITours };
