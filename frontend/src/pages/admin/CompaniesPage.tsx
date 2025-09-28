import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import { getCompanieMail , updateCompanie, deleteCompanie} from "../../services/companieService.ts";

interface Company {
  id: number;
  email: string;
  name: string;
  description: string;
  address: string;
  website: string;
}

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "add" | "edit">("list");
  const [companiesEmails, setCompaniesEmails] = useState<Record<number, string>>({});
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
   const [formData, setFormData] = useState<Partial<Company>>({});

    // Gestion des inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Charger l'email de chaque entreprise
  useEffect(() => {
    companies.forEach(async (company) => {
      if (!companiesEmails[company.id]) {
        const email: string = await getCompanieMail(company.id);
        setCompaniesEmails((prev) => ({
          ...prev,
          [company.id]: email,
        }));
      }
    });
  }, [companies]);

  // Fetch entreprises avec infos users
  useEffect(() => {
    fetch("http://localhost:3000/api/companies")
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération entreprises", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cette entreprise ?")) {
        try {
        await deleteCompanie(id);
        setCompanies(companies.filter((c) => c.id !== id));
        alert("✅ Entreprise supprimé avec succès !");
        }
        catch(err)
        {
          console.error("Erreur suppression", err);
          alert("❌ Échec de la suppression");
        }
    }
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setFormData(company);
    setActiveTab("edit");
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCompany) return;
      try {
            console.log(formData.address);
            const res = await updateCompanie(selectedCompany.id,formData);
            const updated =res;
            setCompanies(companies.map((c) => (c.id === selectedCompany.id ? updated : c)));
            setActiveTab("list");
            setSelectedCompany(null);
            setFormData({});
            alert("✅ Entreprise mise à jour avec succès !");
          }
    catch (err) {
      console.error("Erreur update entreprise", err);
      alert("Échec de la modification");
    }
  };

  return (
    <AdminLayout>
      <div className="text-black">
        <h2 className="text-2xl font-bold mb-4">🏢 Gestion des entreprises</h2>

        {/* Onglets */}
        <div className="flex space-x-4 border-b mb-4">
          <button
            onClick={() => setActiveTab("list")}
            className={`p-2 rounded-t ${
              activeTab === "list" ? "bg-gray-300 font-bold" : "bg-gray-100"
            }`}
          >
            📋 Liste
          </button>
          {activeTab === "edit" && (
            <button
              onClick={() => setActiveTab("edit")}
              className="p-2 rounded-t bg-yellow-200 font-bold"
            >
              ✏️ Modifier
            </button>
          )}
        </div>

        {/* Liste */}
        {activeTab === "list" && (
          <div>
            {loading ? (
              <p className="p-4">Chargement...</p>
            ) : (
              <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-left">
                  <tr>
                    <th className="p-3">Email</th>
                    <th className="p-3">Nom</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Adresse</th>
                    <th className="p-3">Site Web</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.length > 0 ? (
                    companies.map((c) => (
                      <tr key={c.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{companiesEmails[c.id]}</td>
                        <td className="p-3">{c.name}</td>
                        <td className="p-3 max-w-[300px] line-clamp-2">
                          {c.description}
                        </td>
                        <td className="p-3">{c.address}</td>
                        <td className="p-3">{c.website}</td>
                        <td className="p-3 space-x-1">
                          <button
                            onClick={() => handleEdit(c)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-3 text-center">
                        Aucune entreprise trouvée.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Formulaire modification */}
        {activeTab === "edit" && selectedCompany && (
          <form
            onSubmit={handleUpdate}
            className="bg-white shadow p-4 rounded-lg max-w-lg"
          >
            <h3 className="text-xl font-bold mb-4">
              Modifier {selectedCompany.name}
            </h3>

            <input
              type="text"
              name ="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Nom"
              className="border p-2 w-full mb-2"
            />

            <textarea
              name ="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Description"
              className="border p-2 w-full mb-2"
            />

            <input
              name= "address"
              type="text"
              value={formData.address || ""}
              onChange={handleChange}
              
              placeholder="Adresse"
              className="border p-2 w-full mb-2"
            />

            <input
              name = "website"
              type="text"
              value={formData.website || ""}
               onChange={handleChange}
              
              placeholder="Site Web"
              className="border p-2 w-full mb-2"
            />

            <div className="flex space-x-2 mt-4">
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Sauvegarder
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("list")}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default CompaniesPage;
