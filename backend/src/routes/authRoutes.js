const express = require('express');
const router = express.Router();
const { signup, login }= require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);

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
      res.send("Аккаунт успешно подтверждён!");
    } catch (err) {
      res.status(400).send("Недействительная или просроченная ссылка подтверждения");
    }
  });
  

module.exports = router;

