// ============================================================
// AI'DAN OLINGAN TURLARNI BOT FORMATIGA MOSLASHTIRISH
// ============================================================
// Bu modul aiParser.js orqali saqlangan tur paketlarini,
// bot.js kutayotgan "tour" formatiga aylantiradi.
// ============================================================

const { getAllAITours } = require("./aiParser");

async function getTours() {
  const aiTours = getAllAITours();

  return aiTours
    .filter((t) => t.summary_uz) // bo'sh/yaroqsiz yozuvlarni o'tkazib yuboramiz
    .map((t) => {
      const hotelsList = t.hotels && t.hotels.length > 0 ? t.hotels.join(", ") : "";
      const includesList = t.includes && t.includes.length > 0 ? t.includes.join(", ") : "";

      const descUz = [
        t.summary_uz,
        hotelsList ? `🏨 Mehmonxonalar: ${hotelsList}` : "",
        t.date_range ? `📆 Sana: ${t.date_range}` : "",
        t.duration_text ? `⏱ Davomiyligi: ${t.duration_text}` : "",
        includesList ? `✅ Narxga kiradi: ${includesList}` : "",
        t.price_note ? `ℹ️ ${t.price_note}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const descRu = [
        t.summary_ru,
        hotelsList ? `🏨 Отели: ${hotelsList}` : "",
        t.date_range ? `📆 Дата: ${t.date_range}` : "",
        t.duration_text ? `⏱ Продолжительность: ${t.duration_text}` : "",
        includesList ? `✅ Включено: ${includesList}` : "",
        t.price_note ? `ℹ️ ${t.price_note}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      return {
        id: t.id,
        name_uz: t.title,
        name_ru: t.title,
        operator: "MyRichTravel",
        hotel_name: hotelsList,
        price: t.price_usd || 0,
        duration_uz: t.duration_text || "Aniqlashtiriladi",
        duration_ru: t.duration_text || "Уточняется",
        description_uz: descUz,
        description_ru: descRu,
        image: t.photoFileId,
        direction: t.direction,
      };
    });
}

module.exports = { getTours };
