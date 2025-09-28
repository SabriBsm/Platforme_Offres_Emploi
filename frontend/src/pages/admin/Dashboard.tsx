import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import * as uservice from "../../services/usersService.ts";
import * as companyservice from "../../services/companieService.ts";
import * as studentservice from "../../services/studentService.ts";
import * as oservice from "../../services/offerService.ts";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [usersNumber, setUsersNumber] = useState<number>(0);
  const [companiesNumber, setCompaniesNumber] = useState<number>(0);
  const [studentsNumber, setStudentsNumber] = useState<number>(0);

  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [offersByType, setOffersByType] = useState<{ name: string; value: number }[]>([]);
  const [offersNumber, setOffersNumber] = useState<number>(0);
  const [loadingOffersChart, setLoadingOffersChart] = useState<boolean>(true);

  const COLORS = ["#0088FE", "#00C49F", "#FF8042", "#FFBB28"];

  // Récupération stats utilisateurs
  useEffect(() => {
    const fetchUsersNumbers = async () => {
      try {
        const total = await uservice.getUsersNumber();
        const companies = await companyservice.getCompaniesNumber();
        const students = await studentservice.getStudentsNumber();

        setUsersNumber(total);
        setCompaniesNumber(companies.companiesNumber);
        setStudentsNumber(students.studentsNumber);
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre d'utilisateurs", error);
      }
    };
    fetchUsersNumbers();
  }, []);

  // Récupération stats offres (total)
  useEffect(() => {
    const fetchoffers = async () => {
      try {
        const data = await oservice.getOffersNumber();
        setOffersNumber(data.offersNumber);
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre d'offres", error);
      }
    };
    fetchoffers();
  }, []);

  // Récupération offres par type (Stage / Emploi) pour l'année choisie
  useEffect(() => {
    const fetchOffersByType = async () => {
      setLoadingOffersChart(true);
      try {
        const data = await oservice.getOffersByTypeAndYear(year);
        const formattedData = data.map((item: any) => ({
          name: item.type,
          value: item.count
        }));
        setOffersByType(formattedData);
      } catch (error) {
        console.error("Erreur récupération des offres par type", error);
      }
      setLoadingOffersChart(false);
    };
    fetchOffersByType();
  }, [year]);

  const pieDataUsers = [
    { name: "Entreprises", value: companiesNumber },
    { name: "Étudiants", value: studentsNumber }
  ];

  return (
    <AdminLayout>
      <div className="text-black">
        <h2 className="text-2xl font-bold mb-4">Bienvenue sur le Dashboard 🎉</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pie Chart Utilisateurs */}
          <div className="bg-white p-4 rounded shadow text-center">
            <h3 className="text-lg font-semibold mb-2">Répartition des utilisateurs</h3>
            <p className="text-md font-medium mb-4">
              Total utilisateurs : <span className="font-bold">{usersNumber}</span>
            </p>

            {(companiesNumber > 0 || studentsNumber > 0) ? (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieDataUsers}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {pieDataUsers.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">Chargement des données...</p>
            )}
          </div>

          {/* Pie Chart Offres par type */}
          <div className="bg-white p-4 rounded shadow text-center col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold mb-2">Répartition des offres ({year})</h3>

            {/* Nombre total offres */}
            <p className="text-md font-medium mb-4">
              Total offres : <span className="font-bold">{offersNumber}</span>
            </p>

            {/* Sélecteur d'année */}
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border p-2 rounded mb-4"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {loadingOffersChart ? (
              <p>Chargement des données...</p>
            ) : offersByType.length > 0 ? (
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={offersByType}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {offersByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-gray-500">Pas de données pour {year}</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
