const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

//Регистрация 
exports.signup = async (req, res) => {
    try {
        console.log("Тело запроса:", req.body);
        const { email, password, username } = req.body;

        // Проверка на пустые поля
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Все поля обязательны" });
        }

        // Проверка формата email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Некорректный адрес электронной почты" });
        }

        // Валидация длины имени
        if (username.length < 3) {
            return res.status(400).json({ message: "Имя должно быть не менее 3 символов" });
        }

        // Валидация длины пароля
        if (password.length < 6) {
            return res.status(400).json({ message: "Пароль должен быть не менее 6 символов" });
        }

        // Проверка уникальности email и username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email или имя уже заняты" });
        }

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("[Лог] Хеш созданного пароля:", hashedPassword);

        // Создание пользователя
        const user = await User.create({ email, password: hashedPassword, username,isVerified: false});

        // Генерация JWT токена
        const confirmToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        const confirmLink = `https://moonlight-owls.site/api/auth/confirm/${confirmToken}`;

        // Отправка письма
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.EMAIL_USER,        // например: yourmail@gmail.com
            pass: process.env.EMAIL_PASS         // желательно app password
            }
        });
        
        await transporter.sendMail({
            from: `"Moonlight Owls" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Подтверждение регистрации",
            html: `<p>Здравствуйте, ${username}!</p>
                <p>Пожалуйста, подтвердите вашу регистрацию, перейдя по ссылке:</p>
                <a href="${confirmLink}">${confirmLink}</a>`
        });

        res.status(201).json({ message: "Письмо с подтверждением отправлено" });
    } catch (error) {
        console.error("Ошибка в signup:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};


//Вход
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("[Лог] Запрос на вход. Email:", email, "Пароль:", password);

        // Поиск пользователя с явным запросом пароля
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log("[Ошибка] Пользователь не найден");
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        console.log("[Лог] Хеш пароля из БД:", user.password);

        // Сравнение паролей
        const isMatch = await bcrypt.compare(password, user.password);
        console.log("[Лог] Результат сравнения паролей:", isMatch);

        if (!isMatch) {
            console.log("[Ошибка] Пароль не совпадает");
            return res.status(400).json({ message: "Неверный email или пароль" });
        }

        // Проверка подтверждения аккаунта
        if (!user.isVerified) {
            console.log("[Ошибка] Аккаунт не подтверждён");
            return res.status(403).json({ message: "Аккаунт не подтвержден" });
        }

        // Генерация токена
        const tokenExpiresIn = rememberMe ? "31d" : "1d"; // 7 дней или 1 день
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: tokenExpiresIn,
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("[Критическая ошибка] Вход:", error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};

//"забыл пароль"
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }

        // Генерация токена сброса
        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 час
        await user.save();

        // Отправка письма
        const resetLink = `https://moonlight-owls.site/reset-password/${resetToken}`;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: email,
            subject: "Сброс пароля",
            html: `<p>Для сброса пароля перейдите по ссылке:</p>
                   <a href="${resetLink}">${resetLink}</a>`
        });

        res.status(200).json({ message: "Инструкции отправлены на email" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};


// Установка нового пароля
exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Токен недействителен или истек" });
        }

        // Обновление пароля
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: "Пароль успешно изменен" });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
};