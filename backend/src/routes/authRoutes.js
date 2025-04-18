const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, resetPassword}= require("../controllers/authController");
const jwt = require("jsonwebtoken");
const User = require("../models/User")

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, (req, res) => {
    res.json({ userId: req.userId});
});

router.get("/confirm/:token", async (req, res) => {
  try {
      const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      if (!user) return res.status(400).send("Пользователь не найден");

      if (user.isVerified) {
          return res.send("Аккаунт уже подтвержден");
      }

      user.isVerified = true;
      await user.save();
      console.log("Аккаунт подтверждён:", user.email); // Логируем успешное сохранение
      res.send("Аккаунт успешно подтверждён!");
  } catch (err) {
      console.error("Ошибка подтверждения:", err); // Логируем ошибку
      res.status(400).send("Недействительная или просроченная ссылка");
  }
});
  

module.exports = router;

