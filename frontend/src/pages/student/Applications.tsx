import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import {
  getApplicationsByStudent,
  getAllApplications,
  deleteApplication
} from "../../services/applicationService";
import { getStudentId } from "../../utils/auth";

interface Application {
  id: number;
  offer_id: number;
  student_id: number;
  status: string;
  applied_at: string;
  cv_path: string;
  cover_letter_path: string;
  offer_title: string;
  type: string; // stage ou emploi
  company_name: string;
}

const normalizePath = (path: string) => path.replace(/\\/g, "/");

const ApplicationsList = ({ studentId }: { studentId?: number }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Tous");
  const [sortOrder, setSortOrder] = useState("recent");

  const actualStudentId = studentId || getStudentId();

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let data: Application[];
      if (actualStudentId) {
        data = await getApplicationsByStudent(actualStudentId);
      } else {
        data = await getAllApplications();
      }
      setApplications(data);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des candidatures");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [actualStudentId]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette candidature ?")) return;
    try {
      await deleteApplication(id);
      setApplications(applications.filter(app => app.id !== id));
    } catch (err: any) {
      alert(err.message || "Erreur lors de la suppression");
    }
  };

  const filteredApplications = applications
    .filter(app =>
      app.offer_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(app =>
      filterType === "Tous" ||
      (app.type && app.type.toLowerCase() === filterType.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.applied_at).getTime();
      const dateB = new Date(b.applied_at).getTime();
      return sortOrder === "recent" ? dateB - dateA : dateA - dateB;
    });

  if (loading) return <StudentLayout><p>Chargement des candidatures...</p></StudentLayout>;
  if (error) return <StudentLayout><p className="text-red-500">{error}</p></StudentLayout>;

  return (
    <StudentLayout>
      <h2 className="text-2xl font-bold mb-4">Candidatures</h2>

      {/* Recherche + filtre + tri */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="Rechercher par mot clé..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full max-w-md"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="Tous">Tous</option>
          <option value="stage">Stage</option>
          <option value="emploi">Emploi</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="recent">Plus récentes</option>
          <option value="oldest">Plus anciennes</option>
        </select>
      </div>

      {filteredApplications.length === 0 ? (
        <p>Aucune candidature trouvée.</p>
      ) : (
        <ul className="space-y-4">
          {filteredApplications.map(app => (
            <li key={app.id} className="bg-white p-4 rounded shadow flex flex-col gap-2">
              <h3 className="font-semibold text-lg">{app.offer_title}</h3>
              <p><strong>Type :</strong> {app.type}</p>
              <p><strong>Entreprise :</strong> {app.company_name}</p>
              <p><strong>Date de candidature :</strong> {new Date(app.applied_at).toLocaleDateString()}</p>
              <p><strong>Statut :</strong> {app.status}</p>

              <div className="flex gap-2 mt-2 flex-wrap">
                {/* Voir CV */}
                <a
                  href={`http://localhost:3000/files/${normalizePath(app.cv_path)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline"
                >
                  📄 Voir CV
                </a>
                <a
                  href={`http://localhost:3000/files/download/${normalizePath(app.cv_path)}`}
                  download
                  className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                >
                  ⬇️ Télécharger CV
                </a>

                {/* Voir Lettre */}
                {app.cover_letter_path && (
                  <>
                    <a
                      href={`http://localhost:3000/files/${normalizePath(app.cover_letter_path)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      📄 Voir lettre
                    </a>
                    <a
                      href={`http://localhost:3000/files/download/${normalizePath(app.cover_letter_path)}`}
                      download
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      ⬇️ Télécharger lettre
                    </a>
                  </>
                )}

                {/* Supprimer */}
                <button
                  onClick={() => handleDelete(app.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </StudentLayout>
  );
};

export default ApplicationsList;
