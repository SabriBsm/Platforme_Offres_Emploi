import { useEffect, useState } from "react";
import CompanyLayout from "../../layouts/CompanyLayout";
import * as applicationService from "../../services/applicationService";
import type { Application } from "../../types/application";
import { Check, X } from "lucide-react";

export default function ApplicationsRecues() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"all" | "stage" | "emploi">("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const storedCompany = localStorage.getItem("company");
        if (!storedCompany) {
          setError("Aucune société connectée");
          setLoading(false);
          return;
        }
        const company = JSON.parse(storedCompany);
        const data = await applicationService.getApplicationsByCompany(company.id);
        setApplications(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  const filteredApplications = applications
    .filter((app) => {
      const matchesSearch =
        app.first_name.toLowerCase().includes(search.toLowerCase()) ||
        app.title.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        filterType === "all" || app.type === filterType;

      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.applied_at).getTime();
      const dateB = new Date(b.applied_at).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

  const updateStatus = async (id: number, status: "accepted" | "rejected") => {
    try {
      setUpdating(true);
      await applicationService.updateApplicationStatus(id, status);

      // Mise à jour locale immédiate
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      );
      setSelectedApp((prev) => (prev && prev.id === id ? { ...prev, status } : prev));
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <CompanyLayout>
      <h2 className="text-2xl font-bold mb-4">📬 Candidatures reçues</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colonne gauche : liste */}
        <div>
          {/* Filtres */}
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="text"
              placeholder="🔍 Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded flex-1 min-w-[150px]"
            />

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "all" | "stage" | "emploi")}
              className="border p-2 rounded"
            >
              <option value="all">Tous</option>
              <option value="stage">Stage</option>
              <option value="emploi">Emploi</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              className="border p-2 rounded"
            >
              <option value="desc">Plus récent</option>
              <option value="asc">Plus ancien</option>
            </select>
          </div>

          {loading && <p>Chargement...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && filteredApplications.length === 0 && (
            <p>Aucune candidature trouvée.</p>
          )}

          <div className="space-y-3">
            {!loading &&
              !error &&
              filteredApplications.map((app) => (
                <div
                  key={app.id}
                  className={`p-4 bg-white shadow rounded border cursor-pointer ${
                    selectedApp?.id === app.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelectedApp(app)}
                >
                  <h3 className="text-lg font-semibold">
                    {app.first_name} {app.last_name}
                  </h3>
                  <h3 className="text-lg ">{app.email}</h3>
                  <p className="text-gray-600">{app.title}</p>
                  <p className="text-sm text-gray-400">
                    Envoyée le {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                  {app.status && (
                    <p className="mt-1 text-sm font-medium">
                      Statut:{" "}
                      <span
                        className={
                          app.status === "accepted"
                            ? "text-green-600"
                            : app.status === "rejected"
                            ? "text-red-600"
                            : "text-gray-600"
                        }
                      >
                        {app.status}
                      </span>
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Colonne droite : détail */}
        <div className="bg-white shadow rounded p-6 min-h-[300px]">
          {selectedApp ? (
            <>
              <h3 className="text-xl font-bold mb-2">
                {selectedApp.first_name} {selectedApp.last_name}
              </h3>
              <h3 className="text-lg mb-2">{selectedApp.email}</h3>
              <p className="text-gray-600">{selectedApp.title}</p>
              <p className="text-sm text-gray-400 mb-4">
                Candidature envoyée le {new Date(selectedApp.applied_at).toLocaleDateString()}
              </p>

              {/* CV */}
              <div className="mb-4">
                <p><strong>CV :</strong></p>
                <div className="flex gap-3 items-center">
                  <a
                    href={`http://localhost:3000/files/${selectedApp.cv_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    📄 Voir le CV
                  </a>
                  <a
                    href={`http://localhost:3000/files/download/${selectedApp.cv_path}`}
                    download
                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    ⬇️ Télécharger
                  </a>
                </div>
              </div>

              {/* Lettre de motivation */}
              {selectedApp.cover_letter_path && (
                <div className="mb-4">
                  <p><strong>Lettre de motivation :</strong></p>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-3 items-center">
                      <a
                        href={`http://localhost:3000/files/download/${selectedApp.cover_letter_path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        📄 Voir la lettre
                      </a>
                      <a
                        href={`http://localhost3000/files/download/${selectedApp.cover_letter_path}`}
                        download
                        className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                      >
                        ⬇️ Télécharger
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  disabled={updating}
                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  onClick={() => updateStatus(selectedApp.id, "accepted")}
                >
                  <Check size={16} /> Accepter
                </button>
                <button
                  disabled={updating}
                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  onClick={() => updateStatus(selectedApp.id, "rejected")}
                >
                  <X size={16} /> Refuser
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">👉 Sélectionnez une candidature pour voir les détails.</p>
          )}
        </div>
      </div>
    </CompanyLayout>
  );
}
