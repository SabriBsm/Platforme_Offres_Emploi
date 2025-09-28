import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import * as service from "../../services/offerService.ts";
import DatePicker from "react-datepicker";
import * as utils from "../../utils/dateUtils.ts";
import Select from "react-select";

interface Offer {
  id: number;
  title: string;
  name: string;
  type: string;
  company_id: number;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
}

const OffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<{ value: number; label: string }[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [activeTab, setActiveTab] = useState("list");
  const [editingOfferId, setEditingOfferId] = useState<number | null>(null);
  const companiesMap = companies.reduce<Record<number, string>>(
  (acc, c) => ({ ...acc, [c.value]: c.label }),
  {}
);


  // Charger les offres
  useEffect(() => {
    (async () => {
      try {
        const data = await service.getOffers();
        setOffers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Charger les entreprises
  useEffect(() => {
    (async () => {
      try {
        const data = await service.getCompanies();
        setCompanies(data.map((c: any) => ({ value: c.id, label: c.name })));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Supprimer une offre
  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
    try {
      await service.deleteOffer(id);
      alert ("offre supprimé avec success !");
      setOffers(offers.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  // Modifier une offre → pré-remplir le formulaire
  const handleEdit = (id: number) => {
    const offer = offers.find((o) => o.id === id);
    if (offer) {
      setFormData({
        title: offer.title,
        description: offer.description,
        company_id: offer.company_id,
        location: offer.location,
        type: offer.type,
        start_date: offer.start_date,
        end_date: offer.end_date,
      });
      setEditingOfferId(id);
      setActiveTab("add");
    }
  };

  // Enregistrer ou mettre à jour
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      alert("Veuillez attribuer un titre.");
      return;
    }

    try { 
      const payload = {
          ...formData,
         start_date: utils.formatDateForMySQL(formData.start_date),
         end_date: utils.formatDateForMySQL(formData.end_date),
        };
      let data:any  ;
      if (editingOfferId) {
        // Mode modification
        
        data = await service.updateOffer(editingOfferId, payload);
        alert("Offre mis a jour avec success !")
        setOffers(
          offers.map((o) => (o.id === editingOfferId ? { ...data } : o))
        );
      } else {
        // Mode ajout
        data = await service.createOffer(payload);
        alert("Offre créée avec succes !")

        setOffers([...offers, data]);
      }

      // Réinitialiser
      setActiveTab("list");
      setFormData({});
      setEditingOfferId(null);
    } catch (err) {
      console.error(err);
      alert("Échec de l'opération");
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Gestion des Offres</h2>

      {/* Onglets */}
      <div className="mb-4">
        <button
          onClick={() => {
            setActiveTab("list");
            setEditingOfferId(null);
            setFormData({});
          }}
          className={`px-4 py-2 mr-2 ${
            activeTab === "list" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Liste
        </button>
        <button
          onClick={() => {
            setActiveTab("add");
            setEditingOfferId(null);
            setFormData({});
          }}
          className={`px-4 py-2 ${
            activeTab === "add" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          {editingOfferId ? "Modifier" : "Ajouter"}
        </button>
      </div>

      {/* Liste des offres */}
      {activeTab === "list" && (
        <div>
          {loading ? (
            <p className="p-4">Chargement...</p>
          ) : (
            <table className="w-full bg-white shadow rounded-lg overflow-hidden">
              <thead className="bg-gray-200 text-left">
                <tr>
                  <th className="p-3">Titre</th>
                  <th className="p-3">Entreprise</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Lieu</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((offer) => (
                  <tr key={offer.id} className="border-b">
                    <td className="p-3">{offer.title}</td>
                   <td className="p-3">{companiesMap[offer.company_id]}</td>

                    <td className="p-3">{offer.type}</td>
                    <td className="p-3">{offer.location}</td>
                    <td className="p-3">
                      {utils.formatDate(offer.start_date)} -{" "}
                      {utils.formatDate(offer.end_date)}
                    </td>
                    <td className="p-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(offer.id)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(offer.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Formulaire */}
      {activeTab === "add" && (
        <form onSubmit={handleSubmit} className="p-4 bg-white shadow rounded-lg">
          <h3 className="text-xl font-semibold mb-2">
            {editingOfferId ? "✏️ Modifier une offre" : "➕ Ajouter une offre"}
          </h3>

          <label>Titre</label>
          <input
            type="text"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="border w-full p-2 mb-2"
          />

          <label>Description</label>
          <textarea
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="border w-full p-2 mb-2"
          />

          <label>Entreprise</label>
          <Select
            options={companies}
            placeholder="Sélectionner une entreprise"
            onChange={(selectedOption) =>
              setFormData({
                ...formData,
                company_id: selectedOption ? selectedOption.value : null,
              })
            }
            value={companies.find((c) => c.value === formData.company_id) || null}
            isClearable
          />

          <label>Lieu</label>
          <input
            type="text"
            value={formData.location || ""}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="border w-full p-2 mb-2"
          />
         <label>Type</label>
         <select
            value={formData.type || ""}
            onChange={(e) =>
           setFormData({ ...formData, type: e.target.value })
          }
           className="border w-full p-2 mb-2"
           required
            >
           <option value="">-- Sélectionner le type de l'offre --</option>
          <option value="stage">Stage</option>
          <option value="emploi">Emploi</option>
           </select>


          <label>Date de début</label>
          <DatePicker
            selected={
              formData.start_date ? new Date(formData.start_date) : null
            }
            onChange={(date) =>
              setFormData({
                ...formData,
                start_date: date ? date.toISOString().split("T")[0] : "",
              })
            }
            className="border w-full p-2 mb-2"
            dateFormat="yyyy-MM-dd"
          />

          <label>Date de fin</label>
          <DatePicker
            selected={formData.end_date ? new Date(formData.end_date) : null}
            onChange={(date) =>
              setFormData({
                ...formData,
                end_date: date ? date.toISOString().split("T")[0] : "",
              })
            }
            className="border w-full p-2 mb-2"
            dateFormat="yyyy-MM-dd"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {editingOfferId ? "Mettre à jour" : "Enregistrer"}
          </button>
        </form>
      )}
    </AdminLayout>
  );
};

export default OffersPage;
