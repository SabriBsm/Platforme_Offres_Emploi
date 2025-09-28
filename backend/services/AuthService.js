import pool from "../database.js";
import bcrypt from "bcrypt";
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
