import Mailjet from "node-mailjet";
import "./config/env.js";



console.log("API_KEY:", process.env.JWT_SECRET);
console.log("SECRET_KEY:", process.env.MAILJET_SECRET_KEY);

const mailjet = Mailjet.apiConnect(
    process.env.MAILJET_API_KEY,
    process.env.MAILJET_SECRET_KEY
);

export async function sendResetEmail(email, token) {
const resetLink = `http://localhost:5173/reset-password/${encodeURIComponent(token)}`;


    const request = mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
            {
                From: {
                    Email: process.env.MAILJET_SENDER_EMAIL,
                    Name: "Plateforme_Stage_Emploi"
                },
                To: [
                    {
                        Email: email
                    }
                ],
                Subject: "Réinitialisation de votre mot de passe",
                HTMLPart: `<h3>Réinitialisation de mot de passe</h3>
                    <p>Cliquez sur le lien pour réinitialiser votre mot de passe :</p>
                    <a href="${resetLink}">${resetLink}</a>`
            }
        ]
    });

    return request;
}
