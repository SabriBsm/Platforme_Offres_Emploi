

import "./services/config/env.js";
console.log("DEBUG .env ->", {
  api: process.env.MAILJET_API_KEY,
  secret: process.env.MAILJET_SECRET_KEY,
  sender: process.env.MAILJET_SENDER_EMAIL,
});


import studentsRouter from "./routes/students.js";
import usersRouter from "./routes/users.js";
import offersRouter from "./routes/offers.js";
import companiesRouter from "./routes/companies.js";
import authRouter  from "./routes/AuthRoute.js";
import applicationRoutes from "./routes/application.js";
import express from 'express';

import fileRoutes from "./routes/files.js";



const app = express();
const PORT = 3000;
import cors from 'cors';

app.use(express.json());

// Autoriser uniquement ton frontend (Vite par défaut sur 5173)
app.use(cors({
  origin: 'http://localhost:5173'
}));
// test welcome
app.get('/', (req, res) => {
  res.json({ message: 'Welcome Page :) ' });
});


// Test API
app.get('/api/testing', (req, res) => {
  res.json({ message: 'API Express fonctionne depuis back express 🎉' });
});

// Connexion MySQL
//import pool from './database'; // fichier database.js avec mysql2


//recuperer students
app.use("/api/students", studentsRouter);

// recuperer users
app.use("/api/users", usersRouter);

//recupere offers
app.use("/api/offers", offersRouter);

// recuperer companies
app.use("/api/companies", companiesRouter);

//auth
app.use("/api/auth",authRouter );


app.use("/uploads", express.static("uploads"));


app.use("/api/applications", applicationRoutes);


app.use("/files", fileRoutes);



app.listen(PORT, () => {
  console.log(`✅ Backend lancé sur http://localhost:${PORT}`);
});
