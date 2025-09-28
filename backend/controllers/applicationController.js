import pool from "../database.js";
import bcrypt from "bcrypt";
import * as service from "../services/applicationService.js"
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
// POST /api/offers/apply

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
export const applyToOffer = async (req, res) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);
    const { offerId, studentId } = req.body;

    if (!offerId || !studentId) {
      return res.status(400).json({ error: "Champs requis manquants" });
    }

    // Multer place les fichiers dans req.files
    const cv = req.files?.cv?.[0]?.path || null;
    const coverLetter = req.files?.coverLetter?.[0]?.path || null;

    const application = await service.applyToOffer({
      offerId,
      studentId,
      cvPath: cv,
      coverLetterPath: coverLetter,
    });

    res.status(201).json({
      message: "Candidature envoyée avec succès",
      application,
    });
  } catch (error) {
    console.error("Erreur applyToOffer:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};*/

export const applyToOffer = async (req, res) => {
  try {
    const { offerId, studentId } = req.body;

    // ✅ Vérifier présence du CV
    if (!req.files || !req.files.cv || req.files.cv.length === 0) {
      return res.status(400).json({ error: "CV obligatoire" });
    }

    // 📄 Chemin du CV
   let cvPath = req.files.cv[0].filename; 

    cvPath = cvPath.replace(/\\/g, "/"); // normaliser

    // ✉️ Chemin de la lettre de motivation
    let coverLetterPath = null;
    if (req.files.coverLetter && req.files.coverLetter.length > 0) {
      coverLetterPath = req.files.coverLetter
       ? req.files.coverLetter[0].filename
      : null;
      coverLetterPath = coverLetterPath.replace(/\\/g, "/"); // normaliser
    }

    // 📌 Appel au service pour enregistrer en DB
    const app = await service.applyToOffer({
      offerId,
      studentId,
      cvPath,
      coverLetterPath,
    });

    // 🔥 Réponse
    res.status(201).json({ application: app });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// GET /api/applications/student/:studentId
export const getApplicationsByStudentId = async (req, res) => {
  try {
    const { studentId } = req.params;
    const applications = await service.getApplicationsByStudentId(studentId);
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// GET /api/applications
export const getAllApplications = async (req, res) => {
  try {
    const applications = await service.getAllApplications();
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


// DELETE /api/applications/:id
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await service.deleteApplication(id);

    if (!success) {
      return res.status(404).json({ error: "Candidature introuvable" });
    }

    res.json({ message: "Candidature supprimée avec succès" });
  } catch (error) {
    console.error("Erreur deleteApplication:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};



export const getApplicationStats = async (req, res) => {
  try {
    const { studentId } = req.params;
    const stats = await service.getApplicationStatsByStudent(studentId);
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


export const getApplicationsByCompany = async (req, res) => {
  try {
    const companyId = parseInt(req.params.companyId, 10);

    if (isNaN(companyId)) {
      return res.status(400).json({ error: "Company ID invalide" });
    }

    const applications = await service.getApplicationsByCompany(companyId);

    res.json(applications);
  } catch (err) {
    console.error("Erreur getApplicationsByCompany:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


export const changeApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedApplication = await service.updateApplicationStatus(id, status);
    res.json(updatedApplication);
  } catch (err) {
    console.error("Erreur mise à jour statut :", err);
    res.status(400).json({ error: err.message });
  }
};