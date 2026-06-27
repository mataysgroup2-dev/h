# Tur paketlar boti — ishga tushirish yo'riqnomasi

Bu yo'riqnoma sizga botni noldan ishga tushirishni qadam-baqadam tushuntiradi.
Texnik bilim talab qilinmaydi — faqat ko'rsatmalarga amal qiling.

---

## QADAM 1: Telegram'da bot yaratish (5 daqiqa)

1. Telegram'da **@BotFather** nomli rasmiy botni toping (qidiruv orqali).
2. Unga `/newbot` buyrug'ini yuboring.
3. Bot uchun nom kiriting (masalan: `Mening Tur Botim`).
4. Bot uchun username kiriting — oxiri **albatta** `bot` bilan tugashi kerak
   (masalan: `mening_tur_botim_bot`).
5. BotFather sizga uzun bir qator harf-raqamlardan iborat **TOKEN** beradi.
   U shunga o'xshash ko'rinadi:
   `7123456789:AAEhBOweik9ai8xJOuiYdpvruiHpY1ZQ`
6. **Bu tokenni xavfsiz joyga saqlang** — bu sizning botingizning "kaliti".
   Hech kimga bermang.

---

## QADAM 2: Operator guruhini yaratish (3 daqiqa)

Bu — yangi buyurtmalar haqida avtomatik xabar keladigan Telegram guruhi.

1. Telegram'da yangi guruh yarating (masalan: `Tur buyurtmalari`).
2. O'zingiz va kerakli xodimlarni guruhga qo'shing.
3. Yaratgan botingizni ham shu guruhga qo'shing (uni a'zo sifatida qo'shing,
   admin qilish shart emas, lekin xabar yuborishi uchun kamida oddiy
   a'zo bo'lishi kerak).
4. Guruh ID raqamini topish uchun:
   - Guruhga **@RawDataBot** nomli botni qo'shing
   - U guruh ID raqamini avtomatik yuboradi — odatda shunga o'xshash:
     `-1001234567890` (manfiy raqam bilan boshlanadi)
   - Bu raqamni nusxalab oling, keyin @RawDataBot'ni guruhdan chiqarib
     tashlashingiz mumkin

---

## QADAM 3: Kodni kompyuterga tushirish

Men tayyorlagan barcha fayllarni bitta papkaga joylang. Fayllar:
- `bot.js` — asosiy kod
- `tours.js` — tur paketlar ro'yxati
- `texts.js` — bot matnlari (o'zbek/rus)
- `storage.js` — buyurtmalarni saqlash
- `package.json` — kerakli kutubxonalar ro'yxati
- `.env.example` — sozlamalar namunasi

---

## QADAM 4: Sozlamalarni kiritish

1. `.env.example` faylidan nusxa oling va nomini **`.env`** ga o'zgartiring
   (nuqta bilan boshlanishi muhim).
2. `.env` faylini oching va quyidagilarni to'ldiring:

```
BOT_TOKEN=2-qadamda olgan tokeningizni shu yerga yozing
OPERATOR_GROUP_ID=3-qadamda olgan guruh ID raqamini shu yerga yozing
CONTACT_USERNAME=sizning_shaxsiy_yoki_firma_telegram_username
CONTACT_PHONE=+998901234567
```

---

## QADAM 5: Tur paketlarni o'zingiznikiga almashtirish

`tours.js` faylini oching. U yerda 3 ta namuna tur paket bor. Har birini
o'zingizning haqiqiy tur paketlaringiz bilan almashtiring. Har bir paket
uchun to'ldirishingiz kerak bo'lgan maydonlar:

| Maydon | Nima yozish kerak |
|---|---|
| `name_uz` / `name_ru` | Tur nomi (ikki tilda) |
| `operator` | Tur-operator nomi (masalan: Compass Tour) |
| `price` | Narx, so'mda, faqat raqam (vergul/nuqta qo'ymang) |
| `duration_uz` / `duration_ru` | Davomiyligi (masalan: "7 kun / 6 tun") |
| `description_uz` / `description_ru` | Qisqa tavsif |
| `image` | Rasm linki (internetga yuklangan rasm URL'i) |
| `direction` | `turkiya`, `baa`, `misr` yoki `boshqa` |

**Rasm haqida**: eng oson yo'l — rasmni Telegram'dagi biror kanalga yuklab,
undan link olish, yoki Google Drive/Imgur kabi xizmatlarga yuklab, ommaviy
(public) link olish.

---

## QADAM 6: Botni kompyuterda sinab ko'rish (ixtiyoriy, lekin tavsiya etiladi)

Agar kompyuteringizda Node.js o'rnatilmagan bo'lsa, avval
[nodejs.org](https://nodejs.org) dan yuklab oling (oddiy "Next, Next, Finish"
o'rnatish).

Keyin terminal/buyruqlar oynasini ochib, bot papkasiga o'ting va:

```
npm install
npm start
```

Agar hammasi to'g'ri bo'lsa, ekranda `✅ Bot ishga tushdi!` degan yozuv
chiqadi. Endi Telegram'da botingizni topib, `/start` bosing va sinab ko'ring.

To'xtatish uchun terminalda `Ctrl + C` bosing.

---

## QADAM 7: Botni doimiy ishlaydigan holatga keltirish (hosting)

Kompyuteringiz o'chirilganda ham bot ishlab turishi uchun, uni bulutga
("server"ga) joylashtirish kerak. Eng oson va bepul/arzon yo'l —
**Railway.app**:

1. [railway.app](https://railway.app) saytida ro'yxatdan o'ting (GitHub
   hisobi orqali kirish eng tez yo'l).
2. "New Project" tugmasini bosing → "Deploy from GitHub repo" tanlang.
3. Avval kodingizni GitHub'ga yuklashingiz kerak bo'ladi (agar buni qanday
   qilishni bilmasangiz, ayting — alohida qadam-baqadam ko'rsataman).
4. Railway loyihangizni aniqlab, avtomatik ishga tushiradi.
5. Railway loyihasining "Variables" bo'limida `.env` faylidagi barcha
   qiymatlarni (BOT_TOKEN, OPERATOR_GROUP_ID va h.k.) bitta-bitta kiritib
   qo'ying.
6. Saqlagandan so'ng, Railway botni avtomatik qayta ishga tushiradi va u
   24/7 ishlaydigan bo'ladi.

Railway'ning bepul tarifi kichik pilot uchun yetarli (oyiga odatda $5
gacha kredit beriladi, kichik bot uchun bu kifoya).

---

## Muammo yuzaga kelsa

- **Bot javob bermayapti** — `.env` faylidagi BOT_TOKEN to'g'ri
  kiritilganini tekshiring, ortiqcha bo'sh joy yoki tirnoq belgisi
  yo'qligiga ishonch hosil qiling.
- **Operator guruhiga xabar kelmayapti** — OPERATOR_GROUP_ID to'g'ri
  ekanligini va botning guruhga qo'shilganini tekshiring.
- **Rasm ko'rinmayapti** — `tours.js` dagi `image` linki ishlayotganini
  brauzerda ochib tekshiring.

Agar boshqa muammo chiqsa — xabar matnini menga yuborsangiz, birga
hal qilamiz.
