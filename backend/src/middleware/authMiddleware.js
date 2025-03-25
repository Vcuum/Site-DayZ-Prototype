const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    //Получение токена из заголовка
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Нет токена авторизации"});
    }

    try{
        //Проверка токена
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        next();
    }   catch (error) {
        res.status(401).json({ message: "Неверный токен"});
    }
};