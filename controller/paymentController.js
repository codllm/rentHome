const db = require('../util/database');

// STEP 1: CREATE BOOKING (PENDING)
exports.createBooking = async (req, res) => {
  const { homeId, checkIN, checkout, amount, userId } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO booking (home_id, user_id, checkIN, checkout, amount, status)
       VALUES (?, ?, ?, ?, ?, 'PENDING')`,
      [homeId, userId, checkIN, checkout, amount]
    );

    res.json({ bookingId: result.insertId });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// STEP 2: FAKE PAYMENT INFO
exports.createPayment = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const [[booking]] = await db.execute(
      'SELECT amount, status FROM booking WHERE id = ?',
      [bookingId]
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({ message: 'Already paid' });
    }

    res.json({
      upiId: 'airbnb@upi',
      amount: booking.amount,
      transactionId: 'mock_' + Date.now()
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// STEP 3: PAYMENT SUCCESS (FINAL FIX)
exports.paymentSuccess = async (req, res) => {
  const { bookingId, transactionId } = req.body;

  try {
    // 1️⃣ Update booking
    await db.execute(
      `UPDATE booking
       SET status='CONFIRMED', transaction_ref=?
       WHERE id=?`,
      [transactionId, bookingId]
    );

    // 2️⃣ Insert payment
    await db.execute(
      `INSERT INTO payments (booking_id, transaction_id, status)
       VALUES (?, ?, 'SUCCESS')`,
      [bookingId, transactionId]
    );

    res.json({ message: 'Booking confirmed' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
