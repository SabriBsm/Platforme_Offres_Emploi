import pool from "../database.js";
import * as service from "../services/offerService.js";

export const getAllOffers = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT O.id,O.updated_at, O.title, O.location, O.start_date,O.end_date, O.description, O.type, C.name FROM offers O join companies C on O.company_id=C.id");
    res.json(results);
  } catch (err) {
    console.error("Erreur base de données:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const createOffer = async (req, res) => {
  try {
    const { title, description, company_id, location, type, start_date, end_date} = req.body;

    if (!title || !description || !company_id || !location || !type ||!start_date ) {
      return res.status(400).json({ message: "Tous les champs sont obligatoires" });
    }

    const newOffer = await service.createOffer({
      title,
      description,
      company_id,
      location,
      type,
      start_date,
      end_date: end_date || null,
    });

    res.status(201).json(newOffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateOffer =async (req, res) => {
try {
   const offerData = req.body;
   const {id} =req.params;
  
   const updatedOffer = await service.updateOffer(id, offerData);

    res.status(200).json(updatedOffer);

}
catch(err)
{
  console.error("Erreur backend:", err); // <-- log complet
  res.status(500).json({ message: err.message });

}
};

export const deleteOffer = async (req, res) => {
  try
  {
    const {id} = req.params;
    const result = await service.deleteOffer(id);
    res.json({ message: "Offre supprimé avec succès", ...result });
  }
  catch (err)
  {
    console.error(err);
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }

};


// recupérer le nombre des users
export const getoffersNumber = async (req, res) => {
  try {
    const rows = await service.getOffersNumber();
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};




// GET /api/offers/:id
export const getOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "ID d'offre invalide" });
    }

    const offer = await service.getOfferById(id);

    if (!offer) {
      return res.status(404).json({ error: "Offre introuvable" });
    }

    res.json(offer);
  } catch (error) {
    console.error("Erreur getOfferById:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};


export const getCompanyOffers = async (req, res) => {
  try {
    const { companyId } = req.params;
    const offers = await service.getOffersByCompany(companyId);
    res.json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};