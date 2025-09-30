import pool from "../database.js";
import bcrypt from "bcrypt";
import { sendResetEmail } from "./mail.js";
import jwt from "jsonwebtoken";



/*
export const loginUser = async (email, password) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) throw new Error("Utilisateur non trouvé");

  const user = rows[0];

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Mot de passe incorrect");

  return user; // contient id, email, role

};*/
/*
export const loginUser = async (email, password) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) throw new Error("Utilisateur non trouvé");

  const user = rows[0];

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Mot de passe incorrect");

  let student = null;

  if (user.role === "student") {
    const [studentRows] = await pool.query(
      "SELECT first_name, last_name, level, specialty FROM students WHERE id = ?",
      [user.id]
    );
    if (studentRows.length > 0) {
      student = studentRows[0];
    }
  }

  return { user, student };
};*/



export const loginUser = async (email, password) => {
  const [rows] = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) throw new Error("Utilisateur non trouvé");

  const user = rows[0];

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error("Mot de passe incorrect");

  let student = null;
  let company = null;

  if (user.role === "student") {
    const [studentRows] = await pool.query(
      "SELECT first_name, last_name, level, specialty FROM students WHERE id = ?",
      [user.id]
    );
    if (studentRows.length > 0) {
      student = studentRows[0];
    }
  } else if (user.role === "company") {
    const [companyRows] = await pool.query(
      "SELECT id, name, address, description, website FROM companies WHERE id = ?",
      [user.id]
    );
    if (companyRows.length > 0) {
      company = companyRows[0];
    }
  }

  return { user, student, company };
};


export async function forgotPassword(email) {
    const [user] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);

    if (!user.length) throw new Error("Email non trouvé");

    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: "15m" });

    await pool.query("UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?", [
        token,
        Date.now() + 900000,
        user[0].id
    ]);

    await sendResetEmail(email, token);

    return "Email envoyé avec succès";
}


export async function resetPassword(token, password) {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const [user] = await pool.query(
            "SELECT id, reset_expires FROM users WHERE id = ? AND reset_token = ?",
            [payload.id, token]
        );

        if (!user.length) throw new Error("Token invalide");
        if (Date.now() > user[0].reset_expires) throw new Error("Token expiré");

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            "UPDATE users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?",
            [hashedPassword, user[0].id]
        );

        return "Mot de passe réinitialisé avec succès";
    } catch (error) {
        throw new Error("Token invalide ou expiré");
    }
}