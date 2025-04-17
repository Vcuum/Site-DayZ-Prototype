const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Имя пользователя обязательно"],
        trim: true, // Удаляет пробелы в начале и конце
        minLength: [3, "Имя должно быть не менее 3 символов"]
    },
    email: {
        type: String,
        required: [true, "Email обязателен"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Некорректный email"]
    },
    password: {
        type: String,
        required: [true, "Пароль обязателен"],
        minLength: [6, "Пароль должен быть не менее 6 символов"]
    },
    createdAt: {
    type: Date,
    default: Date.now,
    },
    isVerified: {
        type: Boolean,
        default: false
      },      
});

<<<<<<< HEAD
module.exports = mongoose.model("User", userSchema);
=======
module.exports = mongoose.model("User", userSchema);
>>>>>>> 958f275 (changes on server)
