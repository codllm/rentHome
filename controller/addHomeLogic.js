const express = require("express");
const addHomeLogic = express.Router();

addHomeLogic.use(express.urlencoded({ extended: true }));

const db = require("../util/database");
const isAuth = require("../middlewares/isAuth");
const cloudinary = require("../util/cloudinary");
const upload = require("../middlewares/multerMIddleware");
const fs = require("fs");

addHomeLogic.post(
  "/addhomeFormpage",
  isAuth,
  upload.array("images", 5),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).send("No images uploaded");
      }

  
      const image_Url_cloudinary = [];

      for (let file of req.files) {
        const result = await cloudinary.uploader.upload(file.path);
        image_Url_cloudinary.push(result.secure_url);

        // delete temp file
        fs.unlinkSync(file.path);
      }

      const {
        title,
        description,
        location,
        price,
        ac,
        wifi,
        parking,
        bedroom,
      } = req.body;

      const priceNum = Number(price);
      if (!priceNum || priceNum <= 0) {
        return res.status(400).send("Invalid price");
      }

      const userId = req.session.user.id;

      await db.execute(
        `INSERT INTO homes 
         (title, description, location, price, image_url, ac, wifi, parking, bedroom, user_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description,
          location,
          priceNum,
          JSON.stringify(image_Url_cloudinary),
          ac,
          wifi,
          parking,
          bedroom,
          userId,
        ]
      );

      console.log("Home added successfully ✅");
      res.redirect("/host/dashboard");
    } catch (err) {
      console.error("Failed to add home ❌", err);
      res.status(500).send("Something went wrong");
    }
  }
);

module.exports = addHomeLogic;
