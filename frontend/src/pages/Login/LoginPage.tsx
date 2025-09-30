import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import * as authService from "../../services/authService";
import espritLogo from "../../images/esprit.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);
  const handleForgotPassword = async () => {
  if (!email) {
    alert("⚠️ Veuillez entrer votre adresse email.");
    return;
  }

  try {
    const response = await authService.forgotPassword(email);
    alert(`📧 ${response.message || "Lien de réinitialisation envoyé à votre email !"}`);
  } catch (err: any) {
    alert(`❌ ${err.message}`);
  }
};

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await authService.login(email, password);
      if (user.role === "admin") navigate("/dashboard");
      else if (user.role === "company") navigate("/company/dashboard");
      else navigate("/student/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Fonction pour "Mot de passe oublié"
  /*const handleForgotPassword = () => {
    if (!email) {
      alert("⚠️ Veuillez entrer votre adresse email.");
      return;
    }

    // Vérifier si l'email est valide avec une regex simple
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("⚠️ Veuillez entrer une adresse email valide.");
      return;
    }

    // Si email correct
    alert(`📧 Un lien de réinitialisation a été envoyé à : ${email}`);
  };*/

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gray-300">
        
        {/* Logo école */}
        <div className="flex justify-center mb-4">
          <img
            src={espritLogo}
            alt="Logo École"
            className="h-20"
          />
        </div>

        {/* Titre en rouge */}
        <h2 className="text-2xl font-extrabold text-center text-red-600 mb-2">
          Plateforme Offres & Stages
        </h2>
        <p className="text-center text-gray-600 mb-6">Connexion</p>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Adresse email
          </label>
          <input
            type="email"
            placeholder="exemple@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          <label className="block mb-2 text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          />

          {/* Mot de passe oublié */}
          <div className="flex justify-end mb-6">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-red-500 hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
