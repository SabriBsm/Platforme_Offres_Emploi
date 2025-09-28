import * as service from "../services/AuthService.js";
import jwt from "jsonwebtoken";


/*
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, student } = await service.loginUser(email, password); 

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "SECRET_KEY", // éviter hardcoder
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
      student: student || null, // Ajouté
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};
*/


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { user, student, company } = await service.loginUser(email, password);

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "SECRET_KEY", // éviter hardcoder
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
      student: student || null,
      company: company || null, // Ajouté pour l'entreprise
    });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

