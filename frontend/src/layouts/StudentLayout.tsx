import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

interface StudentInfo {
  first_name: string;
  last_name: string;
  level: string;      // ex: "Bac+4"
  specialty: string;  // ex: "Arctic"
}

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [student, setStudent] = useState<StudentInfo | null>(null);

  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("student");
    navigate("/login");
  };

  const formatLevel = (level: string) => {
    const match = level.match(/\+(\d+)/);
    return match ? match[1] : level;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white text-black p-3 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">
          {student
            ? `${student.first_name} ${student.last_name} - ${formatLevel(
                student.level
              )} ${student.specialty}`
            : "Espace Étudiant"}
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
            <Link to="/student/dashboard" className="block p-2 hover:bg-gray-600">
              📊 Tableau de bord
            </Link>
            <Link to="/student/profile" className="block p-2 hover:bg-gray-600">
              👤 Mon profil
            </Link>
            <Link to="/student/offers" className="block p-2 hover:bg-gray-600">
              💼 Offres disponibles
            </Link>
            <Link to="/student/applications" className="block p-2 hover:bg-gray-600">
              📑 Mes candidatures
            </Link>
          </nav>
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 p-6 bg-gray-100">{children}</main>
      </div>
    </div>
  );
};

export default StudentLayout;
