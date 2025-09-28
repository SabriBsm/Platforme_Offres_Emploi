import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { getValidOffers } from "../../services/offerService";
import { Eye } from "lucide-react";
import dayjs from "../../utils/dayjs.config";
import { useNavigate } from "react-router-dom";
interface Offer {
  updated_at: string;
  id: number;
  title: string;
  name: string;
  location: string;
  type: string; // "Stage" ou "Emploi"
  start_date: string;
  end_date: string;
  description: string;
}

const Offers = () => {
  const navigate = useNavigate();
  const [offres, setOffres] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const [sortOrder, setSortOrder] = useState("recent"); // par défaut tri par date décroissante

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const data = await getValidOffers();
        setOffres(data);
        setFilteredOffers(data);
        console.log(data);
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement des offres");
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(term, filterType, sortOrder);
  };

  const handleFilterType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    setFilterType(type);
    applyFilters(searchTerm, type, sortOrder);
  };

  const handleSortOrder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order = e.target.value;
    setSortOrder(order);
    applyFilters(searchTerm, filterType, order);
  };

  const applyFilters = (term: string, type: string, order: string) => {
    let filtered = offres.filter((offer) => {
      const matchesTitle = offer.title.toLowerCase().includes(term.toLowerCase());
      const matchesType = type === "Tous" || offer.type.toLowerCase() === type.toLowerCase();
      return matchesTitle && matchesType;
    });

    // Tri selon updated_at
    filtered.sort((a, b) => {
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      return order === "recent" ? dateB - dateA : dateA - dateB;
    });

    setFilteredOffers(filtered);
  };

  if (loading)
    return (
      <StudentLayout>
        <p>Chargement des offres...</p>
      </StudentLayout>
    );

  if (error)
    return (
      <StudentLayout>
        <p className="text-red-500">{error}</p>
      </StudentLayout>
    );

  return (
    <StudentLayout>
      <h2 className="text-2xl font-bold mb-4">Offres disponibles</h2>

      {/* Barre de recherche + filtre + tri */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Rechercher par titre..."
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-full max-w-md"
        />

        <select
          value={filterType}
          onChange={handleFilterType}
          className="border p-2 rounded"
        >
          <option value="Tous">Tous</option>
          <option value="stage">Stage</option>
          <option value="emploi">Emploi</option>
        </select>

        <select
          value={sortOrder}
          onChange={handleSortOrder}
          className="border p-2 rounded"
        >
          <option value="recent">Plus récentes</option>
          <option value="oldest">Plus anciennes</option>
        </select>
      </div>

      <div className="flex gap-4">
        {/* Liste des offres */}
        <div className="flex-1 grid gap-4">
          {filteredOffers.length === 0 ? (
            <p>Aucune offre trouvée pour "{searchTerm}"</p>
          ) : (
            filteredOffers.map((offre, index) => (
              <div
                key={`${offre.id}-${index}`} // clé unique
                className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg font-semibold">{offre.title}</h3>
                <p className="text-sm text-gray-600">
                  {offre.name} - {offre.location}
                </p>
                <p className="text-sm text-gray-500">Type : {offre.type}</p>
                {offre.start_date && (
                  <p className="text-sm text-gray-500">
                    Début : {new Date(offre.start_date).toLocaleDateString()}
                  </p>
                )}
                {offre.end_date && (
                  <p className="text-sm text-gray-500">
                    Fin : {new Date(offre.end_date).toLocaleDateString()}
                  </p>
                )}
                <p className="text-xs text-green-600 font-bold">
                  Mis à jour : {dayjs.utc(offre.updated_at).format("DD/MM/YYYY")}
                </p>


                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => setSelectedOffer(offre)}
                    className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    <Eye size={16} /> Voir
                  </button>

                              <button
                  onClick={() => navigate(`/offers/${offre.id}/apply`)}
                  className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors"
                >
                  Postuler
                 </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Détails de l'offre */}
        {selectedOffer && (
          <div className="flex-1 bg-white p-6 rounded shadow h-full overflow-auto">
            <h3 className="text-xl font-bold mb-2">{selectedOffer.title}</h3>
            <p>
              <strong>Entreprise :</strong> {selectedOffer.name}
            </p>
            <p>
              <strong>Lieu :</strong> {selectedOffer.location}
            </p>
            <p>
              <strong>Type :</strong> {selectedOffer.type}
            </p>
            <p>
              <strong>Date de début :</strong>{" "}
              {new Date(selectedOffer.start_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Date de fin :</strong>{" "}
              {new Date(selectedOffer.end_date).toLocaleDateString()}
            </p>
            <p className="mt-2">
              <strong>Description :</strong> {selectedOffer.description}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSelectedOffer(null)}
                className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Fermer
              </button>
                          <button
              onClick={() => navigate(`/offers/${selectedOffer.id}/apply`)}
              className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors"
            >
              Postuler
            </button>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Offers;
