import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState, useMemo } from "react";
import * as service from "../../services/offerService.ts";
import * as utils from "../../utils/dateUtils.ts";
import Select from "react-select";
import OfferForm from "../company/offerForm";
import type { OfferFormData } from "../company/offerForm";

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
  const [formData, setFormData] = useState<OfferFormData>({
    title: "",
    description: "",
    location: "",
    type: "",
    start_date: null,
    end_date: null,
  });
  const [activeTab, setActiveTab] = useState<"list" | "add">("list");
  const [editingOfferId, setEditingOfferId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const companiesMap = useMemo(() => {
    return companies.reduce<Record<number, string>>(
      (acc, c) => {
        acc[Number(c.value)] = c.label;
        return acc;
      },
      {}
    );
  }, [companies]);

  // Charger les offres
  useEffect(() => {
    (async () => {
      try {
        const data = await service.getOffers();
        console.log("Offres chargées :", data);
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
        console.log("Entreprises chargées :", data);
        setCompanies(data.map((c: any) => ({ value: c.id, label: c.name })));
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
    try {
      await service.deleteOffer(id);
      setOffers(offers.filter((o) => o.id !== id));
      alert("✅ Offre supprimée avec succès !");
    } catch (err) {
      console.error("Erreur suppression", err);
      alert("❌ Erreur lors de la suppression");
    }
  };

  const handleEdit = (id: number) => {
    const offer = offers.find((o) => o.id === id);
    if (offer) {
      setFormData({
        id: offer.id,
        title: offer.title,
        description: offer.description,
        //company_id: offer.company_id,
        location: offer.location,
        type: offer.type,
        start_date: offer.start_date,
        end_date: offer.end_date,
      });
      setEditingOfferId(id);
      setActiveTab("add");
    }
  };

  const handleSaveOffer = async (offer: OfferFormData) => {
    console.log("Soumission du formulaire :", offer);
    try {
      let data: any;
      if (editingOfferId) {
        data = await service.updateOffer(editingOfferId, offer);
        setOffers(offers.map((o) => (o.id === editingOfferId ? data : o)));
        alert("✅ Offre mise à jour avec succès !");
      } else {
        data = await service.createOffer(offer);
        setOffers([...offers, data]);
        alert("✅ Offre créée avec succès !");
      }
      setActiveTab("list");
      setFormData({
        title: "",
        description: "",
        location: "",
        type: "",
        start_date: null,
        end_date: null,
      });
      setEditingOfferId(null);
    } catch (err) {
      console.error(err);
      alert("❌ Échec de l'opération");
    }
  };

  const filteredOffers = offers.filter((offer) =>
    offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (companiesMap[offer.company_id] || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Gestion des Offres</h2>

      {/* Onglets */}
      <div className="mb-4">
        <button
          onClick={() => {
            setActiveTab("list");
            setEditingOfferId(null);
            setFormData({
              title: "",
              description: "",
              location: "",
              type: "",
              start_date: null,
              end_date: null,
            });
          }}
          className={`px-4 py-2 mr-2 ${activeTab === "list" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Liste
        </button>
        <button
          onClick={() => {
            setActiveTab("add");
            setEditingOfferId(null);
            setFormData({
              title: "",
              description: "",
              location: "",
              type: "",
              start_date: null,
              end_date: null,
            });
          }}
          className={`px-4 py-2 ${activeTab === "add" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          {editingOfferId ? "Modifier" : "Ajouter"}
        </button>
      </div>

      {/* Recherche */}
      {activeTab === "list" && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      )}

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
                {filteredOffers.map((offer) => (
                  <tr key={offer.id} className="border-b">
                    <td className="p-3">{offer.title}</td>
                    <td className="p-3">{offer.name}</td>
                    <td className="p-3">{offer.type}</td>
                    <td className="p-3">{offer.location}</td>
                    <td className="p-3">
                      {utils.formatDate(offer.start_date)} - {utils.formatDate(offer.end_date)}
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
        <div className="p-4 bg-white shadow rounded-lg">
          <OfferForm
            offer={formData}
            onChange={setFormData}
            onSave={handleSaveOffer}
            onCancel={() => setActiveTab("list")}
          />
        </div>
      )}
    </AdminLayout>
  );
};

export default OffersPage;
