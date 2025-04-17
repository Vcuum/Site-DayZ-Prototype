 const express = require('express');
 const mongoose = require("mongoose");
 const dotenv = require("dotenv");
 const cors = require("cors");
 

 dotenv.config();
 
 const app = express();

 //Middleware
 app.use(express.json()); // Для парсинга JSON

 app.use(cors());

//  app.use(cors({ // Укажите ваш домен фронтенда
//    methods: ['GET', 'POST', 'PUT', 'DELETE'],
//    allowedHeaders: ['Content-Type', 'Authorization']
//  }));

 //Подключение к MongoDB
 mongoose.connect(process.env.MONGO_URI) 
   .then(() => console.log("MongoDB подключен"))
   .catch(err => console.log("Ошибка подключения к MongoDB:", err));

 const authRoutes = require('./routes/authRoutes');
 app.use("/api/auth", authRoutes);

 //Тестовый Маршрут 
 app.get("/",(req, res) => {
    res.send("Сервер работает!");
 });

 //Запуск Сервера
 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);

 });
