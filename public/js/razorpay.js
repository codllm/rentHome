document.getElementById("payBtn").onclick = async () => {
  const res = await fetch("/payment/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      homeId: document.getElementById("homeId").value,
      amount: document.getElementById("amount").value,
    }),
  });

  const data = await res.json();

  const options = {
    key: data.key,
    amount: data.amount,
    currency: "INR",
    order_id: data.orderId,
    handler: async function (response) {
      await fetch("/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...response,
          bookingId: data.bookingId,
        }),
      });

      window.location.href = "/payment-success";
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
};
