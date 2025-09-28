import AdminLayout from "../../layouts/AdminLayout";
import { useState } from "react";

const SettingsPage = () => {
  const [platformName, setPlatformName] = useState("Plateforme Offres & Stages");
  const [contactEmail, setContactEmail] = useState("contact@esprit.tn");
  const [themeColor, setThemeColor] = useState("#E30613");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici tu peux ajouter ton appel API pour sauvegarder les paramètres
    alert("Paramètres sauvegardés !");
  };

  return (
    <AdminLayout>
      <div className="text-black">
        <h2 className="text-2xl font-bold mb-4">⚙️ Paramètres de la plateforme</h2>

        <form onSubmit={handleSave} className="p-4 bg-gray-50 rounded-lg shadow space-y-4">
          {/* Nom de la plateforme */}
          <div>
            <label className="block mb-1 font-semibold">Nom de la plateforme</label>
            <input
              type="text"
              value={platformName}
              onChange={(e) => setPlatformName(e.target.value)}
              className="border p-2 w-full rounded bg-white"
            />
          </div>

          {/* Email de contact */}
          <div>
            <label className="block mb-1 font-semibold">Email de contact</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="border p-2 w-full rounded bg-white"
            />
          </div>

          {/* Couleur du thème */}
          <div>
            <label className="block mb-1 font-semibold">Couleur principale (Hex)</label>
            <input
              type="color"
              value={themeColor}
              onChange={(e) => setThemeColor(e.target.value)}
              className="w-16 h-10 p-1 rounded border"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            💾 Sauvegarder
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;
