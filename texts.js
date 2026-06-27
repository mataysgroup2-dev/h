// ============================================================
// BOT MATNLARI (O'zbek va Rus tillari)
// ============================================================
// Bu yerda botning barcha matnlarini topasiz. Xohlasangiz,
// matnlarni o'zingizga moslab o'zgartirishingiz mumkin.
// ============================================================

const TEXTS = {
  uz: {
    welcome: "Assalomu alaykum! 👋\n\nBu — tur paketlarini ko'rish va bron qilish uchun botdir.\n\nQuyidagi menyudan foydalaning:",
    choose_language: "Tilni tanlang / Выберите язык:",
    main_menu_catalog: "🗺 Turlar katalogi",
    main_menu_my_bookings: "📋 Mening buyurtmalarim",
    main_menu_contact: "💬 Operator bilan bog'lanish",
    main_menu_language: "🌐 Tilni o'zgartirish",
    choose_direction: "Qaysi yo'nalish qiziqtiradi?",
    all_directions: "📍 Barcha turlar",
    back: "⬅️ Orqaga",
    main_menu: "🏠 Bosh menyu",
    tour_price: "Narxi",
    tour_duration: "Davomiyligi",
    tour_operator: "Tur-operator",
    book_now: "✅ Bron qilish",
    no_tours_found: "Bu yo'nalishda hozircha tur paket topilmadi.",
    booking_start: "Ajoyib tanlov! 🎉\n\nBronni rasmiylashtirish uchun bir necha savolga javob bering.\n\n1-savol: Ismingiz va familiyangizni yozing:",
    booking_phone: "2-savol: Telefon raqamingizni yozing (masalan: +998901234567):",
    booking_travelers: "3-savol: Nechta kishi sayohat qiladi? (raqam bilan yozing, masalan: 2)",
    booking_date: "4-savol: Qaysi sanada sayohat qilishni istaysiz? (masalan: 15.08.2026)",
    booking_confirm_title: "Buyurtma ma'lumotlarini tekshiring:",
    booking_confirm_tour: "Tur",
    booking_confirm_name: "Ism",
    booking_confirm_phone: "Telefon",
    booking_confirm_travelers: "Sayohatchilar soni",
    booking_confirm_date: "Sana",
    booking_confirm_total: "Jami narx",
    booking_confirm_yes: "✅ Tasdiqlash",
    booking_confirm_no: "❌ Bekor qilish",
    booking_cancelled: "Buyurtma bekor qilindi. Bosh menyuga qaytdingiz.",
    booking_success: "Buyurtmangiz qabul qilindi! 🎉\n\nBuyurtma raqami: #{id}\n\nOperatorimiz tez orada siz bilan bog'lanib, to'lov bo'yicha ma'lumot beradi.\n\nBuyurtma holatini \"Mening buyurtmalarim\" bo'limidan kuzatib borishingiz mumkin.",
    no_bookings: "Sizda hali buyurtmalar yo'q. Katalogdan tur tanlab, bron qilishingiz mumkin.",
    booking_status_pending: "⏳ Ko'rib chiqilmoqda",
    booking_status_confirmed: "✅ Tasdiqlandi",
    booking_status_paid: "💰 To'landi",
    booking_status_cancelled: "❌ Bekor qilindi",
    contact_message: "Savollaringiz bormi? Operatorimiz bilan bog'laning:\n\n📞 Telefon: +998 XX XXX XX XX\n💬 Telegram: @sizning_username",
    invalid_phone: "Iltimos, telefon raqamini to'g'ri formatda yozing (masalan: +998901234567)",
    invalid_number: "Iltimos, faqat raqam kiriting (masalan: 2)",
    language_changed: "Til o'zbek tiliga o'zgartirildi ✅",
  },
  ru: {
    welcome: "Здравствуйте! 👋\n\nЭто бот для просмотра и бронирования туристических пакетов.\n\nИспользуйте меню ниже:",
    choose_language: "Tilni tanlang / Выберите язык:",
    main_menu_catalog: "🗺 Каталог туров",
    main_menu_my_bookings: "📋 Мои заказы",
    main_menu_contact: "💬 Связаться с оператором",
    main_menu_language: "🌐 Изменить язык",
    choose_direction: "Какое направление интересует?",
    all_directions: "📍 Все туры",
    back: "⬅️ Назад",
    main_menu: "🏠 Главное меню",
    tour_price: "Цена",
    tour_duration: "Продолжительность",
    tour_operator: "Туроператор",
    book_now: "✅ Забронировать",
    no_tours_found: "По этому направлению туров пока не найдено.",
    booking_start: "Отличный выбор! 🎉\n\nДля оформления заказа ответьте на несколько вопросов.\n\nВопрос 1: Напишите ваше имя и фамилию:",
    booking_phone: "Вопрос 2: Напишите номер телефона (например: +998901234567):",
    booking_travelers: "Вопрос 3: Сколько человек едет? (напишите число, например: 2)",
    booking_date: "Вопрос 4: На какую дату хотите поехать? (например: 15.08.2026)",
    booking_confirm_title: "Проверьте данные заказа:",
    booking_confirm_tour: "Тур",
    booking_confirm_name: "Имя",
    booking_confirm_phone: "Телефон",
    booking_confirm_travelers: "Количество путешественников",
    booking_confirm_date: "Дата",
    booking_confirm_total: "Итоговая цена",
    booking_confirm_yes: "✅ Подтвердить",
    booking_confirm_no: "❌ Отменить",
    booking_cancelled: "Заказ отменён. Вы вернулись в главное меню.",
    booking_success: "Ваш заказ принят! 🎉\n\nНомер заказа: #{id}\n\nНаш оператор скоро свяжется с вами и расскажет об оплате.\n\nСтатус заказа можно посмотреть в разделе \"Мои заказы\".",
    no_bookings: "У вас пока нет заказов. Выберите тур из каталога и забронируйте.",
    booking_status_pending: "⏳ На рассмотрении",
    booking_status_confirmed: "✅ Подтверждено",
    booking_status_paid: "💰 Оплачено",
    booking_status_cancelled: "❌ Отменено",
    contact_message: "Есть вопросы? Свяжитесь с нашим оператором:\n\n📞 Телефон: +998 XX XXX XX XX\n💬 Telegram: @sizning_username",
    invalid_phone: "Пожалуйста, введите номер телефона в правильном формате (например: +998901234567)",
    invalid_number: "Пожалуйста, введите только число (например: 2)",
    language_changed: "Язык изменён на русский ✅",
  },
};

function t(lang, key, replacements = {}) {
  let text = (TEXTS[lang] && TEXTS[lang][key]) || TEXTS.uz[key] || key;
  for (const [k, v] of Object.entries(replacements)) {
    text = text.replace(`{${k}}`, v);
  }
  return text;
}

module.exports = { TEXTS, t };
