# Telegram kanaldan tur paketlarni AI yordamida avtomatik o'qish

Bu yo'riqnoma botni MYRICHTRAVEL (yoki sizning boshqa manba) kanaliga
ulashni tushuntiradi. Kanalga yangi tur paket e'loni joylanganda, bot
postni Claude AI yordamida "o'qiydi" — har qanday erkin formatda
yozilgan bo'lsa ham (sarlavha, sana, mehmonxonalar, narx, xizmatlar
ro'yxati aralash holda) — va tuzilgan ma'lumotga aylantirib, botda
ko'rsatadi.

**Nega AI kerak edi?** Kanaldagi postlar har safar turlicha formatda
yoziladi (ba'zan bitta mehmonxona-narx ro'yxati, ba'zan to'liq tur
paketi tavsifi sana va xizmatlar bilan). Oddiy shablon (regex) bunday
xilma-xillikni qamrab ololmaydi, shuning uchun postni "o'qish" uchun AI
ishlatiladi — u inson kabi matnni tushunib, kerakli qismlarni ajratib
oladi.

---

## QADAM 1: Anthropic API kalit olish

1. [console.anthropic.com](https://console.anthropic.com) ga kiring va
   ro'yxatdan o'ting (email orqali).
2. Chap menyuda **"Billing"** bo'limiga o'ting, kichik miqdorda kredit
   qo'shing (masalan $5 — sizning hajmingiz uchun oylar davomida
   yetadi, har bir post o'qish ~$0.01 dan kam turadi).
3. **"API Keys"** bo'limiga o'ting → **"Create Key"** → nom bering
   (masalan `tur-bot-parser`) → yarating.
4. Chiqqan kalitni (har doim `sk-ant-...` bilan boshlanadi) nusxalab
   oling — bu faqat bir marta to'liq ko'rsatiladi.

---

## QADAM 2: Botni kanalga admin qilib qo'shish

1. Telegram'da **MYRICHTRAVEL** kanalini oching.
2. Kanal sozlamalari → **"Administrators"** → **"Add Admin"**.
3. Botingizning username'ini qidirib, admin sifatida qo'shing
   (ruxsatlarni o'zgartirish shart emas).

**Eslatma:** Telegram qoidasiga ko'ra, bot kanal a'zosi (admin) bo'lmasa,
kanaldagi postlarni "eshitolmaydi" — bu qadam shart.

---

## QADAM 3: .env faylini to'ldirish

```
SOURCE_CHANNEL_ID=MYRICHTRAVEL
ANTHROPIC_API_KEY=1-qadamda olgan kalitingiz
```

---

## QADAM 4: Botni ishga tushirish

```
npm install
npm start
```

---

## Qanday sinash kerak

Bot **faqat shu vaqtdan keyin** kanalga kelgan postlarni o'qiy oladi
(Telegram'ning o'zi shunday cheklov qo'ygan — eski postlarni orqaga
qaytib o'qish imkonsiz). Sinash uchun ikkita yo'l:

1. **Eng oson:** kanalga yangi (yoki eski, lekin "Forward" qilingan)
   post joylang.
2. Eski postni ochib, uni **shu kanalning o'ziga forward qiling** —
   bu "yangi post" sifatida hisoblanadi.

Terminalda shunga o'xshash xabar chiqishi kerak:

```
✅ AI orqali yangi tur qo'shildi: "Istanbul + Trabzon" (turkiya).
```

Agar post tur paketi e'loni bo'lmasa (masalan oddiy savol/reklama),
bot buni AI orqali aniqlab, e'tiborsiz qoldiradi:

```
ℹ️ Kanal posti o'qildi, lekin AI buni tur paketi e'loni deb topmadi.
```

---

## Botda tekshirish

Telegram'da botni ochib, "Turlar katalogi" → tegishli yo'nalishni
tanlang. AI tomonidan o'qilgan tur — sarlavha, mehmonxonalar, sana,
narx va xizmatlar ro'yxati bilan chiqishi kerak.

---

## Eslatmalar

- **Yo'nalishlar ro'yxati kengaytirildi:** endi 12 ta yo'nalish bor —
  Turkiya, BAA, Misr, Tailand, Vetnam, Bali, Maldiv, Gruziya, Saudiya
  (Umra/Haj), Malayziya, Shri-Lanka, Yevropa, Boshqa. AI postni o'qib,
  shularning biriga avtomatik moslaydi.
- **Bir xil sarlavhali tur qayta e'lon qilinsa, narx avtomatik
  yangilanadi:** agar "Istanbul + Trabzon" nomli tur avval $1099 bo'lib,
  keyinroq xuddi shu nom bilan $1199 deb qayta e'lon qilinsa, bot eski
  yozuvni o'chirib, yangisini saqlaydi — botda faqat eng so'nggi narx
  ko'rinadi. **Muhim:** sarlavha (title) bir xil bo'lishi kerak — agar
  AI ikkinchi safar boshqacha sarlavha o'qisa (masalan "Istanbul-
  Trabzon turi" o'rniga "Istanbul va Trabzon"), bu yangi alohida tur
  sifatida qo'shiladi. Iloji bo'lsa, bir xil turni qayta e'lon
  qilganda, sarlavhani o'zgartirmang.
- **Narx har doim dollarda** ko'rsatiladi (kanal shu valyutada yozgani
  uchun).
- Bot ishlamay turgan vaqtda (kompyuter o'chirilganda) joylangan
  postlar avtomatik o'qilmaydi — shuning uchun botni 24/7 ishlaydigan
  serverga (Railway) joylashtirish tavsiya etiladi (README.md
  7-qadamga qarang).
- **Xarajat haqida:** har bir post o'qish uchun Claude API'ga kichik
  to'lov ketadi (taxminan bir necha tiyin/post). Kuniga 10-20 post
  uchun oyiga $1-3 atrofida bo'ladi.

---

## Muammo yuzaga kelsa

- **"ANTHROPIC_API_KEY .env faylida topilmadi"** — `.env` faylida shu
  qator borligini tekshiring.
- **"AI javobini JSON sifatida o'qib bo'lmadi"** — juda kam uchraydi,
  agar chiqsa, terminaldagi to'liq xabarni menga yuboring.
- **Bot kanal postini umuman ko'rmayapti** — botning kanalga admin
  qilib qo'shilganini tekshiring (2-qadam).
- Boshqa xatolik chiqsa — terminaldagi to'liq xabarni menga yuboring.
