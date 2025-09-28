import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StudentLayout from "../../layouts/StudentLayout";
import { getOfferById, applyToOffer } from "../../services/offerService";

interface Offer {
  id: number;
  title: string;
  name: string;
  location: string;
  type: string;
  start_date: string;
  end_date: string;
  description: string;
}

const ApplyForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [cv, setCv] = useState<File | null>(null);
  const [motivationLetter, setMotivationLetter] = useState<File | null>(null);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        if (id) {
          const data = await getOfferById(parseInt(id));
          setOffer(data);
        }
      } catch (err: any) {
        setError("Impossible de charger l'offre");
      } finally {
        setLoading(false);
      }
    };
    fetchOffer();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("useParams id =", id);
    if (!id) {
      setError("ID de l'offre manquant");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("offerId", id);
      formData.append("studentId", "2"); // ⚡ à remplacer par ID réel étudiant

      if (cv) formData.append("cv", cv);
      if (motivationLetter) formData.append("coverLetter", motivationLetter);

      const result = await applyToOffer(formData);
      console.log(formData);

      if (result?.application?.id) {
        setSuccess("Votre candidature a été envoyée avec succès !");
        setTimeout(() => navigate("/student/offers"), 1500);
      } else {
        setError("Erreur : candidature non créée");
      }
    } catch (err: any) {
      console.error(err);
      setError("Erreur lors de l'envoi de la candidature");
    }
  };

  if (loading) return (
    <StudentLayout>
      <p>Chargement de l'offre...</p>
    </StudentLayout>
  );

  if (error) return (
    <StudentLayout>
      <p className="text-red-500">{error}</p>
    </StudentLayout>
  );

  return (
    <StudentLayout>
      <h2 className="text-2xl font-bold mb-4">Postuler à une offre</h2>

      {offer && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold">{offer.title}</h3>
          <p className="text-sm text-gray-600">{offer.name} - {offer.location}</p>
          <p className="text-sm text-gray-500">Type : {offer.type}</p>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow flex flex-col gap-4 max-w-lg"
      >
        {success && <p className="text-green-600">{success}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div>
          <label className="block mb-1">CV (PDF uniquement)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setCv(e.target.files?.[0] || null)}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Lettre de motivation (PDF ou optionnel)</label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setMotivationLetter(e.target.files?.[0] || null)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => navigate("/student/offers")}
            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
          >
            Envoyer
          </button>
        </div>
      </form>
    </StudentLayout>
  );
};

export default ApplyForm;
