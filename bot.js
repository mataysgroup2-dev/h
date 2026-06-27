// ============================================================
// TUR PAKETLAR BOTI - ASOSIY FAYL
// ============================================================
// Ishga tushirish: node bot.js
// Talab qilinadi: .env faylida BOT_TOKEN va OPERATOR_GROUP_ID
// ============================================================

// dotenv FAQAT lokal kompyuterda .env fayli mavjud bo'lganda
// ishlatiladi. Railway/server muhitida bu fayl yo'q (xavfsizlik
// uchun .gitignore orqali chiqarib tashlangan) - o'rniga Railway
// o'zining "Variables" panelidan to'g'ridan-to'g'ri process.env'ga
// joylaydi, shuning uchun bu yerda hech narsa qilish kerak emas.
const fs = require("fs");
const path = require("path");
if (fs.existsSync(path.join(__dirname, ".env"))) {
  require("dotenv").config();
}

const { Telegraf, Markup, session } = require("telegraf");
const { DIRECTIONS } = require("./tours");
const { getTours } = require("./channelTours");
const { parsePostWithAI, addAITourToDB } = require("./aiParser");
const { t } = require("./texts");
const { addBooking, getBookingsByUser } = require("./storage");

const BOT_TOKEN = process.env.BOT_TOKEN;
const OPERATOR_GROUP_ID = process.env.OPERATOR_GROUP_ID; // operator guruhining ID raqami
const SOURCE_CHANNEL_ID = process.env.SOURCE_CHANNEL_ID; // MYRICHTRAVEL kanalining ID/username'i
const CONTACT_USERNAME = process.env.CONTACT_USERNAME || "sizning_username";
const CONTACT_PHONE = process.env.CONTACT_PHONE || "+998 XX XXX XX XX";

if (!BOT_TOKEN) {
  console.error("XATOLIK: .env faylida BOT_TOKEN topilmadi. README.md ga qarang.");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);
bot.use(session());

// Har bir foydalanuvchi uchun vaqtinchalik holatni saqlash
function getSession(ctx) {
  ctx.session ??= {};
  ctx.session.lang ??= "uz";
  ctx.session.bookingDraft ??= {};
  return ctx.session;
}

function fmtPrice(n) {
  return "$" + n.toLocaleString("en-US");
}

// ---------- KEYBOARDS ----------

function langKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🇺🇿 O'zbekcha", "lang_uz"), Markup.button.callback("🇷🇺 Русский", "lang_ru")],
  ]);
}

function mainMenuKeyboard(lang) {
  return Markup.keyboard([
    [t(lang, "main_menu_catalog")],
    [t(lang, "main_menu_my_bookings"), t(lang, "main_menu_contact")],
    [t(lang, "main_menu_language")],
  ]).resize();
}

function directionsKeyboard(lang) {
  const buttons = Object.entries(DIRECTIONS).map(([key, val]) => [
    Markup.button.callback(val[lang], `dir_${key}`),
  ]);
  buttons.push([Markup.button.callback(t(lang, "all_directions"), "dir_all")]);
  return Markup.inlineKeyboard(buttons);
}

function tourCardKeyboard(lang, tourId) {
  return Markup.inlineKeyboard([[Markup.button.callback(t(lang, "book_now"), `book_${tourId}`)]]);
}

function confirmKeyboard(lang) {
  return Markup.inlineKeyboard([
    [Markup.button.callback(t(lang, "booking_confirm_yes"), "confirm_yes")],
    [Markup.button.callback(t(lang, "booking_confirm_no"), "confirm_no")],
  ]);
}

// ---------- START / LANGUAGE ----------

bot.start((ctx) => {
  const s = getSession(ctx);
  ctx.reply(t(s.lang, "choose_language"), langKeyboard());
});

bot.action("lang_uz", (ctx) => {
  const s = getSession(ctx);
  s.lang = "uz";
  ctx.editMessageText(t("uz", "welcome"));
  ctx.reply(t("uz", "welcome"), mainMenuKeyboard("uz"));
});

bot.action("lang_ru", (ctx) => {
  const s = getSession(ctx);
  s.lang = "ru";
  ctx.editMessageText(t("ru", "welcome"));
  ctx.reply(t("ru", "welcome"), mainMenuKeyboard("ru"));
});

// ---------- MAIN MENU HANDLERS ----------

bot.hears([t("uz", "main_menu_catalog"), t("ru", "main_menu_catalog")], (ctx) => {
  const s = getSession(ctx);
  ctx.reply(t(s.lang, "choose_direction"), directionsKeyboard(s.lang));
});

bot.hears([t("uz", "main_menu_language"), t("ru", "main_menu_language")], (ctx) => {
  const s = getSession(ctx);
  ctx.reply(t(s.lang, "choose_language"), langKeyboard());
});

bot.hears([t("uz", "main_menu_contact"), t("ru", "main_menu_contact")], (ctx) => {
  const s = getSession(ctx);
  ctx.reply(
    t(s.lang, "contact_message")
      .replace("+998 XX XXX XX XX", CONTACT_PHONE)
      .replace("sizning_username", CONTACT_USERNAME)
  );
});

bot.hears([t("uz", "main_menu_my_bookings"), t("ru", "main_menu_my_bookings")], async (ctx) => {
  const s = getSession(ctx);
  const bookings = getBookingsByUser(ctx.from.id);
  if (bookings.length === 0) {
    ctx.reply(t(s.lang, "no_bookings"));
    return;
  }
  const tours = await getTours();
  const statusKey = {
    pending: "booking_status_pending",
    confirmed: "booking_status_confirmed",
    paid: "booking_status_paid",
    cancelled: "booking_status_cancelled",
  };
  let msg = "";
  for (const b of bookings) {
    const tour = tours.find((tt) => tt.id === b.tourId);
    const tourName = tour ? tour[`name_${s.lang}`] : b.tourId;
    msg += `#${b.id} — ${tourName}\n${t(s.lang, statusKey[b.status])}\n\n`;
  }
  ctx.reply(msg.trim());
});

// ---------- CATALOG / DIRECTIONS ----------

bot.action(/^dir_(.+)$/, async (ctx) => {
  const s = getSession(ctx);
  const dir = ctx.match[1];

  let tours;
  try {
    tours = await getTours();
  } catch (err) {
    ctx.answerCbQuery();
    ctx.reply("Kechirasiz, hozir tur paketlarni yuklab bo'lmadi. Birozdan keyin qayta urinib ko'ring.");
    return;
  }

  const filtered = dir === "all" ? tours : tours.filter((tr) => tr.direction === dir);

  if (filtered.length === 0) {
    ctx.answerCbQuery();
    ctx.reply(t(s.lang, "no_tours_found"));
    return;
  }

  ctx.answerCbQuery();
  for (const tour of filtered) {
    // E'TIBOR: parse_mode ataylab ishlatilmaydi (plain text).
    // Tur tavsifida * _ [ ] kabi belgilar bo'lsa ham xato chiqmasligi uchun.
    const priceLine = tour.price > 0
      ? `💵 ${t(s.lang, "tour_price")}: ${fmtPrice(tour.price)}`
      : `💵 ${t(s.lang, "tour_price")}: so'rov bo'yicha`;
    const caption =
      `🏨 ${tour[`name_${s.lang}`]}\n\n` +
      `${tour[`description_${s.lang}`]}\n\n` +
      `🏢 ${t(s.lang, "tour_operator")}: ${tour.operator}\n` +
      priceLine;

    if (tour.image) {
      ctx.replyWithPhoto(tour.image, {
        caption,
        ...tourCardKeyboard(s.lang, tour.id),
      }).catch(() => {
        // Agar rasm yuklanmasa (masalan file_id eskirgan bo'lsa), faqat matn yuboriladi
        ctx.reply(caption, tourCardKeyboard(s.lang, tour.id));
      });
    } else {
      ctx.reply(caption, tourCardKeyboard(s.lang, tour.id));
    }
  }
});

// ---------- BOOKING FLOW ----------

bot.action(/^book_(.+)$/, async (ctx) => {
  const s = getSession(ctx);
  const tourId = ctx.match[1];
  const tours = await getTours();
  const tour = tours.find((tr) => tr.id === tourId);
  if (!tour) return ctx.answerCbQuery();

  s.bookingDraft = { tourId, step: "name" };
  ctx.answerCbQuery();
  ctx.reply(t(s.lang, "booking_start"), Markup.removeKeyboard());
});

bot.on("text", async (ctx, next) => {
  const s = getSession(ctx);
  const draft = s.bookingDraft;

  // Agar buyurtma jarayonida bo'lmasa, boshqa handlerlarga o'tkazamiz
  if (!draft || !draft.step) return next();

  const text = ctx.message.text.trim();

  if (draft.step === "name") {
    draft.name = text;
    draft.step = "phone";
    return ctx.reply(t(s.lang, "booking_phone"));
  }

  if (draft.step === "phone") {
    if (!/^\+?\d{9,13}$/.test(text.replace(/\s/g, ""))) {
      return ctx.reply(t(s.lang, "invalid_phone"));
    }
    draft.phone = text;
    draft.step = "travelers";
    return ctx.reply(t(s.lang, "booking_travelers"));
  }

  if (draft.step === "travelers") {
    const num = parseInt(text, 10);
    if (isNaN(num) || num <= 0) {
      return ctx.reply(t(s.lang, "invalid_number"));
    }
    draft.travelers = num;
    draft.step = "date";
    return ctx.reply(t(s.lang, "booking_date"));
  }

  if (draft.step === "date") {
    draft.date = text;
    draft.step = "confirm";

    const tours = await getTours();
    const tour = tours.find((tr) => tr.id === draft.tourId);
    const total = tour.price * draft.travelers;
    draft.total = total;

    const summary =
      `${t(s.lang, "booking_confirm_title")}\n\n` +
      `🗺 ${t(s.lang, "booking_confirm_tour")}: ${tour[`name_${s.lang}`]}\n` +
      `👤 ${t(s.lang, "booking_confirm_name")}: ${draft.name}\n` +
      `📞 ${t(s.lang, "booking_confirm_phone")}: ${draft.phone}\n` +
      `👥 ${t(s.lang, "booking_confirm_travelers")}: ${draft.travelers}\n` +
      `📅 ${t(s.lang, "booking_confirm_date")}: ${draft.date}\n` +
      `💵 ${t(s.lang, "booking_confirm_total")}: ${fmtPrice(total)}`;

    return ctx.reply(summary, confirmKeyboard(s.lang));
  }

  return next();
});

bot.action("confirm_yes", async (ctx) => {
  const s = getSession(ctx);
  const draft = s.bookingDraft;
  if (!draft || draft.step !== "confirm") return ctx.answerCbQuery();

  const tours = await getTours();
  const tour = tours.find((tr) => tr.id === draft.tourId);

  const booking = addBooking({
    userId: ctx.from.id,
    username: ctx.from.username || "",
    tourId: draft.tourId,
    name: draft.name,
    phone: draft.phone,
    travelers: draft.travelers,
    date: draft.date,
    total: draft.total,
  });

  ctx.answerCbQuery();
  await ctx.editMessageText(t(s.lang, "booking_success", { id: booking.id }));
  await ctx.reply(t(s.lang, "welcome"), mainMenuKeyboard(s.lang));

  // Operator guruhiga avtomatik bildirishnoma
  if (OPERATOR_GROUP_ID) {
    const operatorMsg =
      `🆕 YANGI BUYURTMA #${booking.id}\n\n` +
      `Tur: ${tour.name_uz}\n` +
      `Tur-operator: ${tour.operator}\n` +
      `Mijoz: ${draft.name}\n` +
      `Username: @${ctx.from.username || "yo'q"}\n` +
      `Telefon: ${draft.phone}\n` +
      `Sayohatchilar soni: ${draft.travelers}\n` +
      `Sana: ${draft.date}\n` +
      `Jami narx: ${fmtPrice(draft.total)}\n\n` +
      `Iltimos, ${tour.operator} bilan bog'lanib, joy mavjudligini tasdiqlang.`;
    bot.telegram.sendMessage(OPERATOR_GROUP_ID, operatorMsg).catch((err) => {
      console.error("Operator guruhiga xabar yuborilmadi:", err.message);
    });
  }

  s.bookingDraft = {};
});

bot.action("confirm_no", (ctx) => {
  const s = getSession(ctx);
  ctx.answerCbQuery();
  ctx.editMessageText(t(s.lang, "booking_cancelled"));
  ctx.reply(t(s.lang, "welcome"), mainMenuKeyboard(s.lang));
  s.bookingDraft = {};
});

// ---------- KANALDAN POSTLARNI AVTOMATIK O'QISH ----------
// Bot MYRICHTRAVEL (yoki sizning manba kanalingiz) ga admin
// sifatida qo'shilgan bo'lishi kerak. Shunda har safar kanalga
// yangi post joylanganda, bu handler avtomatik ishga tushadi,
// postni o'qiydi, mehmonxona/narx ro'yxatini ajratadi va
// botning ichki bazasiga saqlaydi.

bot.on("channel_post", async (ctx) => {
  const post = ctx.channelPost;
  if (!post) return;

  // Faqat sozlangan manba kanaldan kelgan postlarni qabul qilamiz
  // (agar SOURCE_CHANNEL_ID sozlanmagan bo'lsa, hamma kanaldan qabul qiladi - test uchun qulay)
  if (SOURCE_CHANNEL_ID && String(post.chat.id) !== String(SOURCE_CHANNEL_ID) && post.chat.username !== SOURCE_CHANNEL_ID) {
    return;
  }

  const text = post.caption || post.text;
  if (!text) return;

  // Agar postda rasm bo'lsa, eng katta o'lchamdagi rasmning file_id'sini olamiz
  let photoFileId = null;
  if (post.photo && post.photo.length > 0) {
    photoFileId = post.photo[post.photo.length - 1].file_id;
  }

  try {
    const aiResult = await parsePostWithAI(text);

    if (!aiResult.is_valid_tour) {
      console.log("ℹ️ Kanal posti o'qildi, lekin AI buni tur paketi e'loni deb topmadi (e'tiborga olinmadi).");
      return;
    }

    const saved = addAITourToDB(aiResult, { photoFileId, sourceMessageId: post.message_id });
    const statusLabel = saved.wasReplaced ? "yangilandi (eski narx almashtirildi)" : "yangi qo'shildi";
    console.log(`✅ AI orqali tur ${statusLabel}: "${saved.title}" (${saved.direction}).`);

    if (OPERATOR_GROUP_ID) {
      bot.telegram
        .sendMessage(
          OPERATOR_GROUP_ID,
          `📡 Kanaldan tur ${statusLabel}: "${saved.title}"\nYo'nalish: ${saved.direction}\nNarx: ${saved.price_usd ? "$" + saved.price_usd : "noma'lum"}`
        )
        .catch(() => {});
    }
  } catch (err) {
    console.error("❌ AI orqali postni o'qishda xatolik:", err.message);
  }
});

// ---------- ERROR HANDLING ----------

bot.catch((err, ctx) => {
  console.error("Bot xatosi:", err);
  ctx.reply("Kechirasiz, xatolik yuz berdi. Iltimos, /start buyrug'ini qayta yuboring.").catch(() => {});
});

bot.launch().then(() => {
  console.log("✅ Bot ishga tushdi!");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
