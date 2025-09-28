import { useEffect, useState } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import * as applicationService from "../../services/applicationService";
import * as authService from "../../services/authService";

interface Stats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");



  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await applicationService.getApplicationStats(user.id);
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    if (user?.id) fetchStats();
  }, [user]);

  return (
    <StudentLayout>
      <h2 className="text-2xl font-bold mb-4">Tableau de bord</h2>

      {stats ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold">Candidatures totales</h3>
            <p className="text-2xl">{stats.total}</p>
          </div>
          <div className="p-4 bg-yellow-100 rounded shadow">
            <h3 className="text-lg font-semibold">En attente</h3>
            <p className="text-2xl">{stats.pending}</p>
          </div>
          <div className="p-4 bg-green-100 rounded shadow">
            <h3 className="text-lg font-semibold">Acceptées</h3>
            <p className="text-2xl">{stats.accepted}</p>
          </div>
          <div className="p-4 bg-red-100 rounded shadow">
            <h3 className="text-lg font-semibold">Refusées</h3>
            <p className="text-2xl">{stats.rejected}</p>
          </div>
        </div>
      ) : (
        <p>Chargement des statistiques...</p>
      )}
    </StudentLayout>
  );
};

export default Dashboard;
