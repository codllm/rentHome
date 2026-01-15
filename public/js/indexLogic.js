console.log("JS FILE LOADED");


let totalRooms = 1;
let guestCount = 1;
const cleaningFee = 250;
let totalPayment = 0;


function updateUI_of_bill() {
  const basePriceInput = document.getElementById("basePrice");
  const checkInVal = document.getElementById("checkIn").value;
  const checkOutVal = document.getElementById("checkOut").value;

  if (!basePriceInput || !checkInVal || !checkOutVal) return;

  const basePrice = parseFloat(basePriceInput.value) || 0;
  const d1 = new Date(checkInVal);
  const d2 = new Date(checkOutVal);

  const diffTime = d2 - d1;
  const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    document.getElementById("displayNights").innerText = "0 nights";
    document.getElementById("displayBaseTotal").innerText = "₹0";
    document.getElementById("finalAmount").innerText = "₹250";
    totalPayment = 250;
    return;
  }


  const baseTotal = basePrice * nights * totalRooms;
  totalPayment = baseTotal + cleaningFee;


  document.getElementById("displayNights").innerText = `${nights} night(s)`;
  document.getElementById("displayBaseTotal").innerText = `₹${baseTotal.toLocaleString("en-IN")}`;
  document.getElementById("finalAmount").innerText = `₹${totalPayment.toLocaleString("en-IN")}`;

 
  const roomRow = document.getElementById("roomMultiplierRow");
  const roomMultText = document.getElementById("displayRoomMult");
  
  if (totalRooms > 1) {
    roomRow.classList.remove("hidden");
    roomRow.classList.add("flex");
    roomMultText.innerText = `x${totalRooms}`;
  } else {
    roomRow.classList.add("hidden");
    roomRow.classList.remove("flex");
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const roomCountEl = document.getElementById("roomCount");
  
  document.getElementById("plusRoom").addEventListener("click", () => {
    totalRooms++;
    roomCountEl.innerText = totalRooms;
    updateUI_of_bill();
  });

  document.getElementById("minusRoom").addEventListener("click", () => {
    if (totalRooms > 1) {
      totalRooms--;
      roomCountEl.innerText = totalRooms;
      updateUI_of_bill();
    }
  });


  const guestCountEl = document.getElementById("guestCount");
  
  document.getElementById("plusGuest").addEventListener("click", () => {
 
    if (guestCount < totalRooms * 2) {
      guestCount++;
      guestCountEl.innerText = guestCount;
    } else {
      alert("You need more rooms for more guests!");
    }
  });

  document.getElementById("minusGuest").addEventListener("click", () => {
    if (guestCount > 1) {
      guestCount--;
      guestCountEl.innerText = guestCount;
    }
  });

  // --- Date Change Listeners ---
  document.getElementById("checkIn").addEventListener("change", updateUI_of_bill);
  document.getElementById("checkOut").addEventListener("change", updateUI_of_bill);

  // --- Payment Submission ---
  document.getElementById("payBtn").addEventListener("click", async () => {
    // Basic validation
    if (!document.getElementById("checkIn").value || !document.getElementById("checkOut").value) {
      return alert("Please select your dates first.");
    }

    try {
      // 1. Create the booking in your database
      const bookingRes = await fetch("/payments/create-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeId: document.getElementById("homeId").value,
          userId: 5, // Hardcoded for your example
          checkIN: document.getElementById("checkIn").value,
          checkout: document.getElementById("checkOut").value,
          amount: totalPayment,
          rooms: totalRooms,
          guests: guestCount
        }),
      });

      const { bookingId } = await bookingRes.json();

      // 2. Initiate payment
      const paymentRes = await fetch("/payments/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      const paymentData = await paymentRes.json();

      // 3. Mock Payment Confirmation (Razorpay/UPI flow)
      const confirmPay = confirm(
        `Pay ₹${totalPayment.toLocaleString("en-IN")} to ${paymentData.upiId}?`
      );

      if (!confirmPay) return alert("Payment cancelled");

      // 4. Record Success
      await fetch("/payments/payment-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          transactionId: paymentData.transactionId,
        }),
      });

      const homeId = document.getElementById("homeId").value;

      alert("Payment successful 🎉");

      // Voice Confirmation
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance(`Payment successful. Home ID ${homeId}. Amount rupees ${totalPayment}. Booking confirmed.`);
        window.speechSynthesis.speak(msg);
      }

      setTimeout(() => {
        location.reload();
      }, 6000);

    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong with the payment.");
    }
  });
});