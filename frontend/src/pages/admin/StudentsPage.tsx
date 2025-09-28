import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import { getStudentMail , updateStudent, deleteStudent } from "../../services/studentService.ts";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  level: string;
  specialty: string;
}

const StudentsPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "edit">("list");
  const [usersEmails, setUsersEmails] = useState<Record<number, string>>({});
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Charger les étudiants
  useEffect(() => {
    fetch("http://localhost:3000/api/students")
      .then((res) => res.json())
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur récupération étudiants", err);
        setLoading(false);
      });
  }, []);

  // Charger email de chaque étudiant
  useEffect(() => {
    students.forEach(async (student) => {
      if (!usersEmails[student.id]) {
        const email: string = await getStudentMail(student.id);
        setUsersEmails((prev) => ({
          ...prev,
          [student.id]: email,
        }));
      }
    });
  }, [students]);

  // Supprimer
  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
      try {
      const data = await deleteStudent(id);
      setStudents(students.filter((s) => s.id !== id));
      alert("✅ Étudiant supprimé avec succès !");

      }
      
      catch  (err) {
      console.error("Erreur suppression", err);
      alert("❌ Échec de la suppression");
      }
    }
  };

  // Modifier (ouvrir formulaire)
  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData(student);
    setActiveTab("edit");
  };

  // Enregistrer modification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;
    try {
 
      const res = await updateStudent(selectedStudent.id,formData);
      const updated =res;
    
      
      

      setStudents(students.map((s) => (s.id === selectedStudent.id ? updated : s)));
      setActiveTab("list");
      setSelectedStudent(null);
      setFormData({});
      alert("✅ Étudiant mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur update étudiant", err);
      alert("Échec de la modification");
    }
  };

  // Gestion des inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AdminLayout>
      <div className="text-black">
        <h2 className="text-2xl font-bold mb-4">👨‍🎓 Gestion des étudiants</h2>

        {/* Onglets */}
        <div className="flex space-x-4 border-b mb-4">
          <button
            onClick={() => setActiveTab("list")}
            className={`p-2 rounded-t ${activeTab === "list" ? "bg-gray-300 font-bold" : "bg-gray-100"}`}
          >
            📋 Liste
          </button>
          {activeTab === "edit" && (
            <button
              onClick={() => setActiveTab("edit")}
              className={`p-2 rounded-t ${activeTab === "edit" ? "bg-gray-300 font-bold" : "bg-gray-100"}`}
            >
              ✏️ Modifier
            </button>
          )}
        </div>

        {/* Liste */}
        {activeTab === "list" && (
          <div>
            {loading ? (
              <p className="p-4">Chargement...</p>
            ) : (
              <table className="w-full bg-white shadow rounded-lg overflow-hidden">
                <thead className="bg-gray-200 text-left">
                  <tr>
                    <th className="p-3">Email</th>
                    <th className="p-3">Nom</th>
                    <th className="p-3">Niveau</th>
                    <th className="p-3">Spécialité</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((s) => (
                      <tr key={s.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">{usersEmails[s.id]}</td>
                        <td className="p-3">
                          {s.first_name} {s.last_name}
                        </td>
                        <td className="p-3">{s.level}</td>
                        <td className="p-3">{s.specialty}</td>
                        <td className="p-3 space-x-2">
                          <button
                            onClick={() => handleEdit(s)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-3 text-center">
                        Aucun étudiant trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Formulaire modification */}
        {activeTab === "edit" && selectedStudent && (
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">✏️ Modifier l’étudiant</h3>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                name="first_name"
                placeholder="Prénom"
                value={formData.first_name || ""}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded bg-white"
              />
              <input
                name="last_name"
                placeholder="Nom"
                value={formData.last_name || ""}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded bg-white"
              />
              <select
                name="level"
                value={formData.level || ""}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded bg-white"
              >
                <option value="">-- Sélectionner le niveau --</option>
                <option value="Bac+1">Bac +1</option>
                <option value="Bac+2">Bac +2</option>
                <option value="Bac+3">Bac +3</option>
                <option value="Bac+4">Bac +4</option>
                <option value="Bac+5">Bac +5</option>
              </select>
              <select
                name="specialty"
                value={formData.specialty || ""}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded bg-white"
              >
                <option value="">-- Sélectionner la spécialité --</option>
                <option value="ARCTIC">ARCTIC</option>
                <option value="DS">DS</option>
                <option value="NIDS">NIDS</option>
                <option value="TWIN">TWIN</option>
                <option value="SE">SE</option>
                <option value="SAE">SAE</option>
                <option value="IA">IA</option>
                <option value="SLEAM">SLEAM</option>
                <option value="IOSYS">IOSYS</option>
                <option value="SIM">SIM</option>
                <option value="INFINI">INFINI</option>
                <option value="GAMIX">GAMIX</option>
              </select>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("list");
                    setFormData({});
                    setSelectedStudent(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Annuler
                </button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default StudentsPage;
