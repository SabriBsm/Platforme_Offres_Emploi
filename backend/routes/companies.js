import express from "express";
import {getAllCompanies, getCompanie, updateCompanie, deleteCompanie, getDashboardStats, getCompanyByEmail} from "../controllers/companieController.js";
const router = express.Router();

// GET - liste des companies
router.get("/", getAllCompanies);

// GET - une entreprise spécifique
router.get("/company/:id", getCompanie);

//Update - une entreprise specifique
router.put("/:id", updateCompanie);

//delete -une entreprise specifique
router.delete("/:id", deleteCompanie);

router.get("/:id/dashboard", getDashboardStats);

//get company by email
router.get("/email",getCompanyByEmail );
export default router;
