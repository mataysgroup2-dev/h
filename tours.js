// ============================================================
// YO'NALISHLAR RO'YXATI
// ============================================================
// E'TIBOR: Endi tur paketlar bu faylda emas. Ular MYRICHTRAVEL
// (yoki sizning manba) Telegram kanalidan avtomatik o'qiladi
// va AI (Claude) yordamida parsing qilinadi (aiParser.js va
// channelTours.js fayllariga qarang). Bu fayl endi faqat
// YO'NALISHLAR (DIRECTIONS) ro'yxati uchun ishlatiladi - bular
// aiParser.js dagi yo'riqnomada aytib o'tilgan davlatlar bilan
// mos kelishi kerak.
//
// Yangi yo'nalish qo'shish uchun: shu yerga qator qo'shing VA
// aiParser.js dagi SYSTEM_PROMPT ichidagi "direction" ro'yxatiga
// ham qo'shing.
//
// Sozlash bo'yicha yo'riqnoma uchun README_KANAL.md faylini
// ko'ring.
// ============================================================

const DIRECTIONS = {
  turkiya: { uz: "🇹🇷 Turkiya", ru: "🇹🇷 Турция" },
  baa: { uz: "🇦🇪 BAA (Dubay)", ru: "🇦🇪 ОАЭ (Дубай)" },
  misr: { uz: "🇪🇬 Misr", ru: "🇪🇬 Египет" },
  tailand: { uz: "🇹🇭 Tailand", ru: "🇹🇭 Таиланд" },
  vetnam: { uz: "🇻🇳 Vetnam", ru: "🇻🇳 Вьетнам" },
  bali: { uz: "🇮🇩 Bali (Indoneziya)", ru: "🇮🇩 Бали (Индонезия)" },
  maldiv: { uz: "🇲🇻 Maldiv orollari", ru: "🇲🇻 Мальдивы" },
  gruziya: { uz: "🇬🇪 Gruziya", ru: "🇬🇪 Грузия" },
  saudiya: { uz: "🇸🇦 Saudiya (Umra/Haj)", ru: "🇸🇦 Саудовская Аравия" },
  malayziya: { uz: "🇲🇾 Malayziya", ru: "🇲🇾 Малайзия" },
  shri_lanka: { uz: "🇱🇰 Shri-Lanka", ru: "🇱🇰 Шри-Ланка" },
  yevropa: { uz: "🇪🇺 Yevropa", ru: "🇪🇺 Европа" },
  boshqa: { uz: "🌍 Boshqa", ru: "🌍 Другое" },
};

module.exports = { DIRECTIONS };
