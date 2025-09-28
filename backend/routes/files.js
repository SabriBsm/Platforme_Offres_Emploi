import express from "express";
import path from "path";

const router = express.Router();

// Route pour voir le fichier dans le navigateur
router.get("/:filename", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Erreur affichage fichier :", err);
      res.status(404).send("Fichier introuvable");
    }
  });
});

// Route pour télécharger
router.get("/download/:filename", (req, res) => {
  const filePath = path.join(process.cwd(), "uploads", req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Erreur téléchargement :", err);
      res.status(500).send("Erreur lors du téléchargement");
    }
  });
});

export default router;
