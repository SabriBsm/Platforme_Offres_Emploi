import express from "express";
import {getAllStudents, getStudent, updateStudent, deleteStudent , getStudentByEmail, getStudentsNumber} from "../controllers/studentController.js";


const router = express.Router();

// GET - liste des étudiants
router.get("/", getAllStudents);

// GET - un étudiant spécifique
router.get("/student/:id", getStudent);

//Put -un étudiant specifique
router.put("/:id", updateStudent);

//delete -un etudiant specifique
router.delete("/:id", deleteStudent);

//GET -un etudiant avec les champs de user
router.get("/studentByEmail",getStudentByEmail );

// get studentsnumber
router.get("/students/studentsNumber",getStudentsNumber );






export default router;
