import pool from "../database.js";
import * as service from "../services/companieService.js";

export const getAllCompanies = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM companies");
    res.json(results);
  } catch (err) {
    console.error("Erreur base de données:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getCompanie = async (req, res) => {
  try {
      const { id } = req.params;
      const [rows] = await pool.query("SELECT * FROM companies WHERE id = ?", [id]);
  
      if (rows.length === 0) {
        return res.status(404).json({ error: "entreprise non trouvé" });
      }
  
      res.json(rows[0]); // renvoie le premier (et seul) résultat
    } catch (err) {
      console.error("Erreur base de données:", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
};

export async function updateCompanie(req, res) {
  try {
    const id = req.params.id;
    const updated = await service.updateCompanie(id, req.body);
    res.json(updated);
  } catch (err) {
    console.error("Erreur updateCompanie:", err);
    res.status(500).json({ error: "Erreur lors de la mise à jour de l'entreprise" });
  }
}

export async function deleteCompanie(req, res) {
  try {
    const id = req.params.id;
    const result = await service.deleteCompany(id);
    res.json({ message: "Entreprise supprimé avec succès", ...result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
}



export async function getDashboardStats(req, res) {
  const companyId = parseInt(req.params.id, 10);

  if (!companyId) {
    return res.status(400).json({ error: "ID de l'entreprise invalide" });
  }

  try {
    const stats = await service.getCompanyDashboardStats(companyId);
    res.json(stats);
  } catch (error) {
    console.error("Erreur dans getDashboardStats:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}


export const getCompanyByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const company = await service.getCompanyByEmail(email);

    if (!company) {
      return res.status(404).json({ error: "Entreprise non trouvée" });
    }

    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
