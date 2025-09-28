import express from "express";
import { applyToOffer, getAllApplications,getApplicationsByStudentId, deleteApplication, getApplicationStats, getApplicationsByCompany 
  , changeApplicationStatus
} from "../controllers/applicationController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// route POST pour postuler

router.post(
  "/apply",
  upload.fields([
    { name: "cv", maxCount: 1 },
    { name: "coverLetter", maxCount: 1 },
  ]),
  applyToOffer
);
/*
router.post("/apply", (req, res) => {
  res.json({ message: "Route apply OK" });
});*/

router.get("/student/:studentId", getApplicationsByStudentId);
router.get("/", getAllApplications);

//route delete candidature
router.delete("/:id", deleteApplication);

router.get("/stats/:studentId", getApplicationStats);

//get application by companyid
router.get("/company/:companyId", getApplicationsByCompany);
// Route pour servir les fichiers uploadés
router.patch("/:id/status", changeApplicationStatus);

export default router;
