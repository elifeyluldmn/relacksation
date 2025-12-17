// backend/routes/reservation.js
const express = require('express');
const Reservation = require('../models/Reservation');
const router = express.Router();

// Yeni rezervasyon oluştur
router.post('/reservation', async (req, res) => {
  const { name, startDate, endDate, rentalType, products, phone, email, address, totalPrice } = req.body;

  try {
    const newReservation = new Reservation({
      name,
      startDate,
      endDate,
      rentalType,
      products,
      phone,
      email,
      address,
      totalPrice,
    });

    await newReservation.save();
    res.status(201).send("Reservation saved successfully!");
  } catch (error) {
    res.status(500).send("Error saving reservation: " + error.message);
  }
});

module.exports = router;

const sendEmail = require("../services/emailService"); // backendde

await newReservation.save();
await sendEmail("owner-email@example.com", `Reservation by ${name}...`);

