import express from "express";

import { getAllUsers , createUser, updateUser, deleteUser, getUsers, getStudentMailC, getCompanieMailC ,  getUsersNumber , changePassword} from "../controllers/userController.js";

const router = express.Router();

//get mail de entreprise

//get mail de student
router.get("/companieMail/:id", getCompanieMailC);


router.get("/:id", getStudentMailC);
//get-liste-user-selon-email
router.get("/", getUsers);
// GET - liste des users
router.get("/", getAllUsers);
// Post -creer user
router.post("/",createUser );

// Route PUT pour modifier un utilisateur
router.put("/users/:id", updateUser);

//route delete pour supprimer un utilisateur
router.delete("/:id", deleteUser);

// get users number
router.get("/users/number", getUsersNumber);


//PUT- Mot de passe
router.put("/change-password",changePassword );

export default router;
