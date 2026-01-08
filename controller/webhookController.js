const crypto = require("crypto");
const db = require("../util/database");

exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.body)
      .digest("hex");

    const signature = req.headers["x-razorpay-signature"];

    if (expectedSignature !== signature) {
      return res.status(400).send("Invalid signature");
    }

    const data = JSON.parse(req.body.toString());
    const event = data.event;
    const payment = data.payload.payment.entity;

    if (event === "payment.captured") {
      const [[booking]] = await db.execute(
        "SELECT id FROM booking WHERE razorpay_order_id = ?",
        [payment.order_id]
      );

      if (booking) {
        await db.execute(
          "UPDATE booking SET status = 'CONFIRMED' WHERE id = ?",
          [booking.id]
        );

        await db.execute(
          `INSERT INTO payments (booking_id, razorpay_payment_id, status)
           VALUES (?, ?, 'SUCCESS')`,
          [booking.id, payment.id]
        );
      }
    }

    if (event === "payment.failed") {
      await db.execute(
        "UPDATE booking SET status = 'CANCELLED' WHERE razorpay_order_id = ?",
        [payment.order_id]
      );
    }

    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send("Webhook error");
  }
};
