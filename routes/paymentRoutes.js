const express = require('express');
const router = express.Router();
const controller = require('../controller/paymentController');

router.post('/create-booking', controller.createBooking);
router.post('/create-payment', controller.createPayment);
router.post('/payment-success', controller.paymentSuccess);

module.exports = router;
