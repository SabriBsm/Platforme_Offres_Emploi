import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import CompanyLayout from "../../layouts/CompanyLayout";
import { useNavigate } from "react-router-dom";
import { changeUserPassword } from "../../services/usersService";
import { getCompanyByEmail, updateCompanie } from "../../services/companieService";
import type { Company } from "../../services/companieService";

const Profile = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    description: "",
    address: "",
    website: "",
    old_password: "",
    new_password: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Charger les données au montage
  useEffect(() => {
    const company = localStorage.getItem("company");
    const user = localStorage.getItem("user");

    if (company && user) {
      const parsedCompany = JSON.parse(company);
      const parsedUser = JSON.parse(user);

      setFormData({
        email: parsedUser.email,
        name: parsedCompany.name || "",
        description: parsedCompany.description || "",
        address: parsedCompany.address || "",
        website: parsedCompany.website || "",
        old_password: "",
        new_password: "",
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleChangePassword = async () => {
    try {
      await changeUserPassword({
        old_password: formData.old_password,
        new_password: formData.new_password,
      });

      alert("Mot de passe changé avec succès !");
      setFormData((prev) => ({ ...prev, old_password: "", new_password: "" }));
    } catch (error: any) {
      setErrorMessage(error.message || "Erreur lors du changement du mot de passe");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1 — Changer le mot de passe si rempli
      if (formData.old_password && formData.new_password) {
        await handleChangePassword();
      }

      // 2 — Mettre à jour le profil entreprise
      const company: Company = await getCompanyByEmail(formData.email);
      await updateCompanie(company.id, {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        website: formData.website,
      });

      // 🔹 Mettre à jour localStorage
      const updatedCompany = {
        ...company,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        website: formData.website,
      };
      localStorage.setItem("company", JSON.stringify(updatedCompany));

      alert("Profil mis à jour avec succès !");
      setFormData((prev) => ({
        ...prev,
        old_password: "",
        new_password: "",
        name: updatedCompany.name,
        description: updatedCompany.description,
        address: updatedCompany.address,
        website: updatedCompany.website,
      }));
    } catch (error: any) {
      setErrorMessage(error.message || "Erreur lors de la mise à jour du profil");
    }
  };

  return (
    <CompanyLayout>
      <h2 className="text-2xl font-bold mb-4">Mon profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-lg">

        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100 text-gray-500"
          />
        </div>

        {/* Ancien mot de passe */}
        <div>
          <label className="block font-medium">Mot de passe actuel</label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              placeholder="********"
              className="w-full border p-2 rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1"
            >
              {showOldPassword ? <EyeOff size={16} color="black" /> : <Eye size={16} color="black" />}
            </button>
          </div>
        </div>

        {/* Nouveau mot de passe */}
        <div>
          <label className="block font-medium">Nouveau mot de passe</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              placeholder="********"
              className="w-full border p-2 rounded pr-10"
              disabled={!formData.old_password}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1"
            >
              {showNewPassword ? <EyeOff size={16} color="black" /> : <Eye size={16} color="black" />}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Laissez vide si vous ne voulez pas changer le mot de passe.
          </p>
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {/* Nom */}
        <div>
          <label className="block font-medium">Nom</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        {/* Adresse */}
        <div>
          <label className="block font-medium">Adresse</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Site Web */}
        <div>
          <label className="block font-medium">Site Web</label>
          <input
            type="text"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Boutons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-[#E30613] text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Sauvegarder
          </button>
          <button
            type="button"
            onClick={() => navigate("/company/dashboard")}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </CompanyLayout>
  );
};

export default Profile;
