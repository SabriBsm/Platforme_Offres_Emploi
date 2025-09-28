import express from "express";

import {getAllOffers , createOffer, updateOffer, deleteOffer, getoffersNumber, getOfferById, getCompanyOffers, getOffersByTypeAndYear } from "../controllers/offerController.js";


const router = express.Router();

// GET - liste des offres
router.get("/", getAllOffers);

// create offer
router.post("/", createOffer);

//update offer
router.put("/:id",updateOffer );

//delete offer
router.delete("/:id", deleteOffer);

// get offers number
router.get("/offers/number", getoffersNumber);

//get offer by ID

router.get("/:id", getOfferById);

//get offers by company id
router.get("/company/:companyId", getCompanyOffers);

//get offer by type and year
router.get("/alloffers/bytype", getOffersByTypeAndYear);


export default router;
