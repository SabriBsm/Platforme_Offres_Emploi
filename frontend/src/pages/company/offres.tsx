import { useEffect, useState } from "react";
import { Eye, Trash2 } from "lucide-react";
import CompanyLayout from "../../layouts/CompanyLayout";
import * as offerService from "../../services/offerService";
import OfferForm from "./offerForm";
import type { OfferFormData } from "./offerForm";

export type Offer = {
  id: number;
  title: string;
  description: string;
  location?: string;
  type?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  company_id?: number;
};

export default function CompanyOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingOffer, setEditingOffer] = useState<OfferFormData | null>(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"recent" | "oldest">("recent");

  const storedCompany = localStorage.getItem("company");
  const company = storedCompany ? JSON.parse(storedCompany) : null;

  useEffect(() => {
    const loadOffers = async () => {
      try {
        if (!company) {
          setError("Aucune société connectée");
          setLoading(false);
          return;
        }
        const data = await offerService.getOffersByCompany(company.id);
        setOffers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadOffers();
  }, [company]);

  const handleEdit = (offer: Offer) => {
    setEditingOffer({
      id: offer.id,
      title: offer.title,
      description: offer.description,
      location: offer.location || "",
      type: offer.type || "",
      start_date: offer.start_date || "",
      end_date: offer.end_date || "",
    });
  };

  const handleAdd = () => {
    setEditingOffer({
      title: "",
      description: "",
      location: "",
      type: "",
      start_date: "",
      end_date: "",
    });
  };

  const handleSave = async (offerData: OfferFormData) => {
    if (!company) return;

    try {
      if (offerData.id) {
        const updated = await offerService.updateOffer(offerData.id, {
          ...offerData,
          company_id: company.id,
        });
        setOffers(offers.map((o) => (o.id === offerData.id ? updated : o)));
      } else {
        const created = await offerService.createOffer({
          ...offerData,
          company_id: company.id,
        });
        setOffers([...offers, created]);
      }
      setEditingOffer(null);
    } catch (err: any) {
      alert("Erreur: " + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette offre ?")) return;

    try {
      await offerService.deleteOffer(id);
      setOffers(offers.filter((o) => o.id !== id));
    } catch (err: any) {
      alert("Erreur suppression: " + err.message);
    }
  };

  const filteredOffers = offers
    .filter((o) => o.title.toLowerCase().includes(search.toLowerCase()))
    .filter((o) => (filterType ? o.type === filterType : true))
    .sort((a, b) => {
      const dateA = new Date(a.updated_at || "").getTime();
      const dateB = new Date(b.updated_at || "").getTime();
      return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

  return (
    <CompanyLayout>
      <h2 className="text-2xl font-bold mb-4">📢 Mes offres</h2>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-grow"
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Tous les types</option>
          <option value="stage">Stage</option>
          <option value="emploi">Emploi</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as "recent" | "oldest")}
          className="border p-2 rounded"
        >
          <option value="recent">Récent → Ancien</option>
          <option value="oldest">Ancien → Récent</option>
        </select>

        <button
          onClick={handleAdd}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ Ajouter une offre
        </button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 max-w-md space-y-4">
          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && filteredOffers.length === 0 && <p>Aucune offre trouvée.</p>}

          {!loading &&
            !error &&
            filteredOffers.map((offer) => (
              <div
                key={offer.id}
                className="p-4 bg-white shadow rounded border hover:bg-gray-50 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold">{offer.title}</h3>
                  <p className="text-gray-600">{offer.description.slice(0, 100)}...</p>
                  <p className="text-sm text-gray-400">
                    Publiée le {new Date(offer.updated_at || "").toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    <Eye size={16} /> Voir / Modifier
                  </button>

                  <button
                    onClick={() => handleDelete(offer.id)}
                    className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>
              </div>
            ))}
        </div>

        {editingOffer && (
          <div className="flex-1 bg-white p-6 rounded shadow h-full overflow-auto">
            <OfferForm
              offer={editingOffer}
              onChange={(data) => setEditingOffer(data)}
              onSave={handleSave}
              onCancel={() => setEditingOffer(null)}
            />
          </div>
        )}
      </div>
    </CompanyLayout>
  );
}
