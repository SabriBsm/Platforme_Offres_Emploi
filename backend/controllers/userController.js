import pool from "../database.js";
import bcrypt from "bcrypt";
import * as service from "../services/userService.js"
import jwt from "jsonwebtoken";

//import {getUsersFromDB, getStudentMail, getCompanieMail, getUsersNumber} from "../services/userService.js"


// Créer un utilisateur
export const createUser = async (req, res) => {
  const { 
    email, password, role, 
    first_name, last_name, level, specialty, 
    name, description, address, website, date_of_birth 
  } = req.body;

  const connection = await pool.getConnection(); // ⚡ récupérer une connexion

  try {
    await connection.beginTransaction(); // 🚀 démarrer la transaction

    // 1. Vérifier si email existe déjà
    const [existing] = await connection.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "❌ Cet email existe déjà"
      });
    }

    // 2. Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // 3. Insert dans users
    const [rows] = await connection.query(
      "INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)",
      [email, password_hash, role]
    );

    const id = rows.insertId; // L'id de user récupéré

    const [users] = await connection.query(
      "SELECT id, email, role, created_at FROM users WHERE id = ?",
      [id]
    );
    const user = users[0];

    // 4. Insert dans table spécifique
    if (role === "student") {
      await connection.query(
        "INSERT INTO students (id, first_name, last_name, level, specialty, date_of_birth) VALUES (?, ?, ?, ?, ?, ?)",
        [id, first_name, last_name, level, specialty, date_of_birth]
      );
    } else if (role === "company") {
      await connection.query(
        "INSERT INTO companies (id, name, description, address, website) VALUES (?, ?, ?, ?, ?)",
        [id, name, description, address, website]
      );
    }

    // 5. Valider la transaction
    await connection.commit();

    res.status(201).json({
      success: true,
      message: "✅ Utilisateur ajouté avec succès",
      user
    });

  } catch (err) {
    await connection.rollback(); // ❌ annuler tout si erreur
    console.error("Erreur base de données:", err);
    res.status(500).json({ success: false, error: "Échec de l'ajout de l'utilisateur" });
  } finally {
    connection.release(); // libérer la connexion
  }
};



// PUT /users/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, ...updateData } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Vérifier si l'email existe déjà pour un autre utilisateur
    if (updateData.email) {
      const [existing] = await connection.query(
        "SELECT id FROM users WHERE email = ? AND id != ?",
        [updateData.email, id]
      );

      if (existing.length > 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: "❌ Cet email est déjà utilisé par un autre utilisateur"
        });
      }
    }

    // 2. Mise à jour de la table users (infos génériques)
    await connection.query(
      "UPDATE users SET email = ?, role = ? WHERE id = ?",
      [updateData.email, role, id]
    );

    // 3. Mise à jour spécifique selon le rôle
    if (role === "student") {
      await connection.query(
        "UPDATE students SET first_name = ?, last_name = ? WHERE id = ?",
        [updateData.first_name, updateData.last_name, id]
      );
    } else if (role === "company") {
      await connection.query(
        "UPDATE companies SET name = ?, description = ?, address = ?, website = ? WHERE id = ?",
        [updateData.name, updateData.description, updateData.address, updateData.website, id]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
      user: { id, ...updateData, role }
    });

  } catch (err) {
    await connection.rollback();
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur" });
  } finally {
    connection.release();
  }
};

// recupérer les utilisateurparmail
export const getUsers = async (req, res) => {
  try {
    const { email } = req.query;  // ?email=xxx
    const users = await service.getUsersFromDB(email);
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM users");
    res.json(results);
  } catch (err) {
    console.error("Erreur base de données:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// supprimer user
// DELETE /users/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM users WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    console.error("Erreur suppression :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

//
// recupérer le mail d'un User

export const getStudentMailC = async (req, res) => {
  try {
    const { id } = req.params; // <- important: params et pas query
    const rows = await service.getStudentMail(id);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucun email trouvé" });
    }

    // Retourner seulement un objet { email: ... }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


// recupérer le mail d'une entreprise
export const getCompanieMailC = async (req, res) => {
  try {
    const { id } = req.params; // <- important: params et pas query
    const rows = await service.getCompanieMail(id);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Aucun email trouvé" });
    }

    // Retourner seulement un objet { email: ... }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// recupérer le nombre des users
export const getUsersNumber = async (req, res) => {
  try {
    const rows = await service.getUsersNumber();
    const number = rows[0].usersNumber; 
    res.json(number - 1); 
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};


export const changePassword = async (req, res) => {
  const { old_password, new_password } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token manquant" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");
    const studentId = decoded.id;

    const result = await service.changeStudentPassword(studentId, old_password, new_password);

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



