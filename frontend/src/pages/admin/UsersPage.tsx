import AdminLayout from "../../layouts/AdminLayout";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getUsers, createUser, updateUser, getCompany, getStudent , deleteUser, searchUsersByEmail} from "../../services/usersService.ts";


interface User {
  id: number;
  email: string;
  role: "admin" | "company" | "student";
  created_at: string;
}



const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"list" | "add-update">("list");
  const [selectedRole, setSelectedRole] = useState<"student" | "company" | "admin">("student");
  const [formData, setFormData] = useState<any>({});
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // nombre d’utilisateurs par page
  const [searchEmail, setSearchEmail] = useState("");
  
  // empecher une date de naissance nouvelle, age min 19 ans
  const nineteenYearsAgo = new Date();
  nineteenYearsAgo.setFullYear(nineteenYearsAgo.getFullYear() - 19);



  //fetch users by mail
  const fetchUsersByMail = async (email?: string): Promise<void> => {
    try {
      const data: User[] = await searchUsersByEmail(email);
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsersByMail();
  }, []);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchEmail(value);
    fetchUsersByMail(value);
  };

  // Quand on clique sur modifier
  const handleUpdateClick = async (user: any) => {
  setSelectedRole(user.role);
  let specificData = {};

  if (user.role === "student") {
    specificData = await getStudent(user.id);
  } else if (user.role === "company") {
    specificData = await getCompany(user.id);
  }

  setFormData({
    ...user,          // email, role, etc.
    ...specificData   // champs spécifiques
  });

  setSelectedUser(user);
  setMode("edit");
  setActiveTab("add-update");
};


  // Charger les utilisateurs
  useEffect(() => {
    (async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Supprimer utilisateur
const handleDelete = async (id: number) => {
  if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

  try {
    const data = await deleteUser(id);
    alert(data.message);

    // Mettre à jour la liste localement
    setUsers(users.filter((user) => user.id !== id));
  } catch (error) {
    alert("Erreur lors de la suppression.");
  }
};

  // Ajouter ou modifier
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      // Validation manuelle
  if (selectedRole === "student") {
    if (!formData.date_of_birth) {
      alert("Veuillez saisir une date de naissance.");
      return;
    }
    const dob = new Date(formData.date_of_birth);
    if (dob > new Date()) {
      alert("La date de naissance ne peut pas être dans le futur.");
      return;
    }
    if (!formData.level) {
      alert("Veuillez sélectionner un niveau.");
      return;
    }
    if (!formData.specialty) {
      alert("Veuillez sélectionner une spécialité.");
      return;
    }
  }
    try {
      if (mode === "create") {
        const data = await createUser({ ...formData, role: selectedRole });
        alert(data.message);
        setUsers([...users, data.user]);
      } else if (mode === "edit" && selectedUser) {
        const data = await updateUser(selectedUser.id, { ...formData, role: selectedRole });
        alert(data.message);
        setUsers(users.map((u) => (u.id === selectedUser.id ? data.user : u)));
      }

      setActiveTab("list");
      setFormData({});
      setSelectedUser(null);
      setMode("create");
    } catch (err) {
      console.error(err);
      alert("Échec de l'opération");
    }
  };

  // Gestion des inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AdminLayout>
      <div className="text-black">
        <h2 className="text-2xl font-bold mb-4">👥 Gestion des utilisateurs</h2>

        {/* Onglets */}
        <div className="flex space-x-4 border-b mb-4">
          <button
            onClick={() => setActiveTab("list")}
            className={`p-2 rounded-t ${activeTab === "list" ? "bg-gray-300 font-bold" : "bg-gray-100"}`}
          >
            📋 Liste
          </button>
          <button
            onClick={() => setActiveTab("add-update")}
            className={`p-2 rounded-t ${activeTab === "add-update" ? "bg-gray-300 font-bold" : "bg-gray-100"}`}
          >
            Ajouter / Modifier
          </button>
        </div>

{/* Partie liste des utilisateurs avec pagination */}
{activeTab === "list" && (
  <div>
    {loading ? (
      <p className="p-4">Chargement...</p>
    ) : (
      <>

            <input
        type="text"
        value={searchEmail}
        onChange={handleSearchChange}
        placeholder="Rechercher par email..."
      />

        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Rôle</th>
              <th className="p-3">Date de création</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage)
              .map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`py-1 px-3 rounded-full text-xs ${
                        u.role === "admin"
                          ? "bg-purple-200 text-purple-600"
                          : u.role === "company"
                          ? "bg-blue-200 text-blue-600"
                          : "bg-green-200 text-green-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleUpdateClick(u)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded text-white disabled:opacity-50"
          >
             Précédent
          </button>
          <span className="px-3 py-1">
            Page {currentPage} / {Math.ceil(users.length / usersPerPage)}
          </span>
          <button
            disabled={currentPage === Math.ceil(users.length / usersPerPage)}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded text-white disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      </>
    )}
  </div>
)}


        {/* Formulaire ajout / modification */}
        {activeTab === "add-update" && (
          <div className="p-4 bg-gray-50 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">
              {mode === "create" ? "➕ Ajouter un utilisateur" : "✏️ Modifier l'utilisateur"}
            </h3>
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Champs communs */}
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email || ""}
                onChange={handleChange}
                required
                className="border p-2 w-full rounded bg-white"
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password || ""}
                onChange={handleChange}
                required={mode === "create"} // facultatif en modification
                className="border p-2 w-full rounded bg-white"
              />

              {/* Rôle */}
              <select
                name="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as "student" | "company" | "admin")}
                className="border p-2 w-full rounded bg-white"
              >
                <option value="student">👨‍🎓 Étudiant</option>
                <option value="company">🏢 Entreprise</option>
                <option value="admin">👑 Admin</option>
              </select>

              {/* Étudiant */}
              {selectedRole === "student" && (
                <>
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
            
                  <DatePicker 
                    selected={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
                    onChange={(date: Date | null) =>
                      setFormData({ ...formData, date_of_birth: date ? date.toISOString().split("T")[0] : "" })
                    }
                    className="border p-2 w-full rounded bg-white text-black"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Date de naissance"
                    maxDate={nineteenYearsAgo } 
                    
                  />
            
                </>
              )}

              {/* Entreprise */}
              {selectedRole === "company" && (
                <>
                  <input
                    name="name"
                    placeholder="Nom de l'entreprise"
                    value={formData.name || ""}
                    onChange={handleChange}
                    required
                    className="border p-2 w-full rounded bg-white"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded bg-white"
                  />
                  <input
                    name="address"
                    placeholder="Adresse"
                    value={formData.address || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded bg-white"
                  />
                  <input
                    name="website"
                    placeholder="Site web"
                    value={formData.website || ""}
                    onChange={handleChange}
                    className="border p-2 w-full rounded bg-white"
                  />
                </>
              )}

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("list");
                    setFormData({});
                    setMode("create");
                    setSelectedUser(null);
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

export default UsersPage;
