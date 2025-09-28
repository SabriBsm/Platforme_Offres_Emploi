import pool from "../database.js";
import *  as service from  "../services/studentService.js";

export const getAllStudents = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM students");
    res.json(results);
  } catch (err) {
    console.error("Erreur base de données:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    res.json(rows[0]); // renvoie le premier (et seul) résultat
  } catch (err) {
    console.error("Erreur base de données:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export async function updateStudent(req, res) {
  try {
    const id = req.params.id;
    const updated = await service.updateStudent(id, req.body);
    res.json(updated);
  } catch (err) {
    console.error("Erreur updateStudent:", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'étudiant" });
  }
}

export async function deleteStudent(req, res) {
  try {
    const id = req.params.id;
    const result = await service.deleteStudent(id);
    res.json({ message: "Étudiant supprimé avec succès", ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
}


//get etudiant avec champs de user
export const getStudentByEmail = async (req, res) => {
  try {
    const email  = req.query.email;
    if (!email) {
      return res.status(400).json({ error: "Email requis" });
    }
    const rows = await service.getStudentByEmail(email);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    res.json(rows[0]); // renvoie le premier (et seul) résultat
  } catch (err) {
    console.error("Erreur base de données:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


