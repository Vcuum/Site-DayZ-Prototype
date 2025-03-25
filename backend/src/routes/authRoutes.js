const express = require('express');
const router = express.Router();
const { signup, login }= require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);

const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, (req, res) => {
    res.json({ userId: req.userId});
});

module.exports = router;

