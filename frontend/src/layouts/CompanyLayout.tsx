import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface CompanyInfo {
  name: string;
  address: string;   // Exemple : "Informatique"
  
}

const CompanyLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [company, setCompany] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    const storedCompany = localStorage.getItem("company");
    if (storedCompany) {
      setCompany(JSON.parse(storedCompany));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("company");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white text-black p-3 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">
          {company
            ? `${company.name} - ${company.address}`
            : "Espace Entreprise 1"}
        </h1>
        <button
          className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800"
          onClick={handleLogout}
        >
          Déconnexion
        </button>
      </header>

      {/* Sidebar */}
      <div className="flex flex-1">
        <aside className="w-64 bg-black text-white p-4 space-y-4 hidden md:block">
          <nav className="space-y-2">
            <Link to="/company/dashboard" className="block p-2 hover:bg-gray-600">
              📊 Tableau de bord
            </Link>
            <Link to="/company/profile" className="block p-2 hover:bg-gray-600">
              🏢 Mon profil
            </Link>
            <Link to="/company/offers" className="block p-2 hover:bg-gray-600">
              📢 Mes offres
            </Link>
            <Link to="/company/applications" className="block p-2 hover:bg-gray-600">
              📑 Candidatures reçues
            </Link>
          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default CompanyLayout;
