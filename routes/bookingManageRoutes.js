const express = require('express');
const bookingManageRoutes = express.Router();

const bookingReceipt = require('../controller/bookingReceipt');

bookingManageRoutes.get(
  '/booking/:bookingId/home/:homeId',
  async (req, res) => {

    const { bookingId, homeId } = req.params;
    console.log('received params:', bookingId, homeId);

    try {
      const receiptData = await bookingReceipt(homeId, bookingId);

      if (!receiptData) {
        return res.status(404).send('error',{message:'Receipt not found'});
      }

      // ✅ Render EJS
      res.render('receipt', { receiptData });

    } catch (err) {
      console.error("Error in booking management route:", err);
        res.status(500).send('error',{message:'Internal Server Error'});
    }
  }
);

module.exports = bookingManageRoutes;
