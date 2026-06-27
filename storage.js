// ============================================================
// BUYURTMALARNI SAQLASH (oddiy fayl-asosli baza)
// ============================================================
// Pilot bosqichi uchun buyurtmalar bookings.json fayliga
// yoziladi. Bu fayl bot ishlagan papkada avtomatik yaratiladi.
// Keyinroq (native ilova bosqichida) bu haqiqiy ma'lumotlar
// bazasiga (PostgreSQL) almashtiriladi.
// ============================================================

const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "bookings.json");

function loadBookings() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
  }
  const raw = fs.readFileSync(DB_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveBookings(bookings) {
  fs.writeFileSync(DB_FILE, JSON.stringify(bookings, null, 2));
}

function addBooking(booking) {
  const bookings = loadBookings();
  const id = bookings.length + 1;
  const newBooking = {
    id,
    status: "pending", // pending -> confirmed -> paid -> cancelled
    createdAt: new Date().toISOString(),
    ...booking,
  };
  bookings.push(newBooking);
  saveBookings(bookings);
  return newBooking;
}

function getBookingsByUser(userId) {
  const bookings = loadBookings();
  return bookings.filter((b) => b.userId === userId);
}

function updateBookingStatus(id, status) {
  const bookings = loadBookings();
  const booking = bookings.find((b) => b.id === id);
  if (booking) {
    booking.status = status;
    saveBookings(bookings);
  }
  return booking;
}

module.exports = { addBooking, getBookingsByUser, updateBookingStatus, loadBookings };
