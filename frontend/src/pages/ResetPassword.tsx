import type { FC } from "react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword: FC = () => {
  const { token } = useParams<{ token?: string }>();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!token) return <div style={{ color: "black" }}>Token manquant ou invalide</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: decodeURIComponent(token), password }),
      });
      console.log(res);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Erreur");

      setMessage("Mot de passe réinitialisé avec succès !");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      setMessage(error.message || "Erreur lors de la réinitialisation");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        padding: "20px",
        backgroundColor: "white", // 👈 fond blanc
        color: "black",           // 👈 texte noir
      }}
    >
      <h2>Réinitialiser le mot de passe</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "8px",
            marginBottom: "10px",
            color: "black",           // texte noir dans l'input
          }}
        />
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "8px",
            color: "black",           // texte noir du bouton
            backgroundColor: "#f0f0f0", // petit contraste pour cliquer
          }}
        >
          Réinitialiser
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
