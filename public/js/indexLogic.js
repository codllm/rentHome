let totalRooms = 1;
let totalGuests = 1;
const cleaningFee = 250;
let totalPayment = 0;

function updateUI_of_bill() {
  const basePrice = parseFloat(document.getElementById("basePrice").value) || 0;
  const checkInVal = document.getElementById("checkIn").value;
  const checkOutVal = document.getElementById("checkOut").value;

  if (checkInVal && checkOutVal) {
    const d1 = new Date(checkInVal);
    const d2 = new Date(checkOutVal);

    const timeDiff = d2 - d1;
    const numberOfNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (numberOfNights > 0) {
      const baseTotal = basePrice * numberOfNights * totalRooms;
      const finalAmount = baseTotal + cleaningFee;
      totalPayment = finalAmount;

      document.getElementById(
        "displayNights"
      ).innerText = `${numberOfNights} night(s)`;
      document.getElementById(
        "displayBaseTotal"
      ).innerText = `₹${baseTotal.toLocaleString("en-IN")}`;
      document.getElementById(
        "finalAmount"
      ).innerText = `₹${finalAmount.toLocaleString("en-IN")}`;
    }
  }
}

document.getElementById("checkIn").onchange = updateUI_of_bill;
document.getElementById("checkOut").onchange = updateUI_of_bill;
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("payBtn").addEventListener("click", async () => {
    try {
      const bookingRes = await fetch("/payments/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeId: document.getElementById("homeId").value,
          userId: 5,
          checkIN: document.getElementById("checkIn").value,
          checkout: document.getElementById("checkOut").value,
          amount: 64650,
        }),
      });

      const { bookingId } = await bookingRes.json();

      const paymentRes = await fetch("/payments/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const paymentData = await paymentRes.json();

      const confirmPay = confirm(
        `Pay ₹${paymentData.amount} to ${paymentData.upiId}?`
      );

      if (!confirmPay) return alert("Payment cancelled");

      await fetch("/payments/payment-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          transactionId: paymentData.transactionId,
        }),
      });

      const homeId = document.getElementById("homeId").value;
      const amount = paymentData.amount;

      alert("Payment successful 🎉");

      

      location.reload();
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  });
});
const homeId = document.getElementById("homeId").value;
const amount = Number(paymentData.amount);

alert("Payment successful 🎉");

speak(
  `Payment successful.
   Home I D ${homeId}.
   Amount rupees ${amount}.
   Booking confirmed.`
);

// 👇 reload AFTER speech
setTimeout(() => {
  location.reload();
}, 6000);

