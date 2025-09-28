import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // ✅ Supprimer le token du stockage local
    localStorage.removeItem("token");

    // 🔄 Rediriger vers la page de login
    navigate("/login");
  };
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
     <header className="bg-white text-black p-3 flex justify-between items-center shadow">
  <h1 className="text-xl font-bold">Espace Administrateur</h1>
  <button className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors duration-200"
   onClick={handleLogout}>
    Déconnexion
  </button>
</header>


      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-black text-white p-4 space-y-4 hidden md:block">
          <nav className="space-y-2">
          <Link
  to="/dashboard"
  className="block p-2 hover:bg-gray-600 rounded transition-colors duration-200"
>
  📊 Tableau de bord
</Link>
<Link to="/offers" className="block p-2 hover:bg-gray-600 rounded transition-colors duration-200">
  💼 Offres
</Link>
<Link to="/users" className="block p-2 hover:bg-gray-600 rounded transition-colors duration-200">
  👥 Utilisateurs
</Link>
<Link to="/students" className="block p-2 hover:bg-gray-600 rounded transition-colors duration-200">
  👨‍🎓 Étudiants
</Link>
<Link to="/companies" className="block p-2 hover:bg-gray-600 rounded transition-colors duration-200">
  🏢 Entreprises
</Link>
{
/*
<Link to="/settings" className="block p-2 hover:bg-gray-600 rounded transition-colors duration-200">
  ⚙️ Paramètres
</Link>*/}

          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>

      {/* Footer */}
      <footer className="bg-[#E30613] text-white p-4 flex justify-center items-center">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <img
              src="/logoOfficielEsprit.png"
              alt="ESPRIT Logo"
              className="h-8 w-auto"
            />
          </div>
          <p>© 2025 - Plateforme Offres & Stages - ESPRIT</p>
          <div className="mt-2 space-x-4">
            <a
              href="https://www.esprit.tn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              Site officiel ESPRIT
            </a>
            <a
              href="/contact"
              className="text-white hover:text-gray-200 transition-colors duration-200"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;