import * as service from "../services/AuthService.js";
import jwt from "jsonwebtoken";


console.log("secret:", process.env.JWT_SECRET);
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

export async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        const message = await service.forgotPassword(email);
        res.json({ message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function resetPassword(req, res) {
    try {
        const { token } = req.body;
        const { password } = req.body;
        const message = await service.resetPassword(token, password);
        res.json({ message });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}