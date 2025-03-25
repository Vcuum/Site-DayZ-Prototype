const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Регистрация 
exports.signup = async (req, res) => {  // "req" вместо "requestAnimationFrame"
    try {
        console.log("Тело запроса:", req.body);
        const {email, password,username } = req.body;

        // Проверка на пустые поля
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Все поля обязательны" });
        }
        
        // Проверка уникальности email и username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email или имя уже заняты" });
        }

        
        //Создание пользователя
        const user = await User.create({ email, password, username });
        

        //Генерация JWT токена
        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(201).json({ token });
    } catch (error) {
        console.error("Ошибка в signup:", error);
        res.status(500).json({ message: "Ошибка сервера"});
    }
};

//Вход
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //Поиск пользователя 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        //Проверка пароля
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(400).json({ message: "Неверный email или пароль"});
        }


       //Генерация JWT токена 
       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
       });

       res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера"});
    }
};