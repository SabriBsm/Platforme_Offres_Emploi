import { useEffect, useState } from "react";
import CompanyLayout from "../../layouts/CompanyLayout";
import { getCompanyStats } from "../../services/companieService";

const CompanyDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const company = JSON.parse(localStorage.getItem("company") || "{}");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getCompanyStats(company.id);
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (company?.id) fetchStats();
  }, [company]);

  return (
    <CompanyLayout>
      <h2 className="text-2xl font-bold mb-4">Tableau de bord</h2>

      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold">Offres publiées</h3>
            <p className="text-2xl">{stats.totalOffers}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded shadow">
            <h3 className="text-lg font-semibold">Candidatures reçues</h3>
            <p className="text-2xl">{stats.totalApplications}</p>
          </div>
          <div className="p-4 bg-blue-100 rounded shadow">
            <h3 className="text-lg font-semibold">En attente</h3>
            <p className="text-2xl">{stats.pendingApplications}</p>
          </div>
          <div className="p-4 bg-green-100 rounded shadow">
            <h3 className="text-lg font-semibold">Acceptées</h3>
            <p className="text-2xl">{stats.acceptedApplications}</p>
          </div>
        </div>
      ) : (
        <p>Chargement des statistiques...</p>
      )}
    </CompanyLayout>
  );
};

export default CompanyDashboard;
