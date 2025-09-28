import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import * as uservice from  "../../services/usersService.ts";
import * as oservice from "../../services/offerService.ts";
const Dashboard = () => {
  const [usersNumber, setUsersNumber] = useState<number>(0);
   useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await uservice.getUsersNumber();
        setUsersNumber(data.usersNumber);
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre d'utilisateurs", error);
      }
    };

    fetchUsers();
  }, []); // [] => exécuté uniquement quand le composant est monté


  //charger nombre des offres
  const [offersNumber, setoffersNumber] = useState<number>(0);
   useEffect(() => {
    const fetchoffers = async () => {
      try {
        const data = await oservice.getOffersNumber();
        setoffersNumber(data.offersNumber);
      } catch (error) {
        console.error("Erreur lors de la récupération du nombre d'utilisateurs", error);
      }
    };

    fetchoffers();
  }, []); // [] => exécuté uniquement quand le composant est monté

  return (
  
    <AdminLayout>
      <div className="text-black">
      <h2 className="text-2xl font-bold mb-4">Bienvenue sur le Dashboard 🎉</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Utilisateurs</h3>
          <p className="text-2xl font-bold text-blue-600">{usersNumber}</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h3 className="text-lg font-semibold">Offres publiées</h3>
          <p className="text-2xl font-bold text-green-600">{offersNumber}</p>
        </div>
        
      </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
