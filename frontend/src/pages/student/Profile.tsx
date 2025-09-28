import StudentLayout from "../../layouts/StudentLayout";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import DatePicker from "react-datepicker";
import { getStudentByEmail , updateStudent} from "../../services/studentService"; //  service
import type { Student } from "../../services/studentService";
import { changeUserPassword } from "../../services/usersService";
import { useNavigate } from "react-router-dom"; // 


const Profile = () => {
    console.log("Profile monté !");

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    level: "",
    specialty: "",
    date_of_birth: "",
    old_password: "",
    new_password: "",
  });
  const navigate = useNavigate();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
  const loadStudentData = async () => {
    try {
      const user = localStorage.getItem("user"); 
      if (user)
      {
        const parsedUser= JSON.parse(user);
        const email = parsedUser.email;
        console.log(email);

      
       const student: Student = await getStudentByEmail(email);
      

      setFormData({
        email: student.email,
        first_name: student.first_name,
        last_name: student.last_name,
        level: student.level,
        specialty: student.specialty,
        date_of_birth: student.date_of_birth || "",
        old_password: "",
        new_password: "",
      });}
      if (!user) return;
    } catch (error) {
      console.error("Erreur récupération profil :", error);
    }
  };

  loadStudentData();
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // 1 — Changer le mot de passe si rempli
    if (formData.old_password && formData.new_password) {
      await handleChangePassword();
    }

    // 2 — Mettre à jour le profil étudiant
    const student: Student = await getStudentByEmail(formData.email);
      await updateStudent(student.id, {
      first_name: formData.first_name,
      last_name: formData.last_name,
      level: formData.level,
      specialty: formData.specialty,
      date_of_birth: formData.date_of_birth,
    });

    alert("Profil mis à jour avec succès !");
    setFormData({ ...formData, old_password: "", new_password: "" });
  } catch (error: any) {
    setErrorMessage(error.message || "Erreur lors de la mise à jour du profil");
  }
};




  const handleChangePassword = async () => {
  try {
    await changeUserPassword({
      old_password: formData.old_password,
      new_password: formData.new_password,
    });

    alert("Mot de passe changé avec succès !");
    setFormData({ ...formData, old_password: "", new_password: "" });
  } catch (error: any) {
    setErrorMessage(error.message);
  }
};
  return (
    <StudentLayout>
      <h2 className="text-2xl font-bold mb-4">Mon profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow max-w-lg">
        
        {/* Email */}
        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            disabled
            className="w-full border p-2 rounded bg-gray-100 text-gray-500"
          />
        </div>

        {/* Ancien mot de passe */}
        <div>
          <label className="block font-medium">Mot de passe actuel</label>
          <div className="relative">
            <input
              type={showOldPassword ? "text" : "password"}
              name="old_password"
              value={formData.old_password}
              onChange={handleChange}
              placeholder="********"
              className="w-full border p-2 rounded pr-10"
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1"
            >
              {showOldPassword ? <EyeOff size={16} color="black" /> : <Eye size={16} color="black" />}
            </button>
          </div>
        </div>

        {/* Nouveau mot de passe */}
        <div>
          <label className="block font-medium">Nouveau mot de passe</label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              name="new_password"
              value={formData.new_password}
              onChange={handleChange}
              placeholder="********"
              className="w-full border p-2 rounded pr-10"
              disabled={!formData.old_password}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-1"
            >
              {showNewPassword ? <EyeOff size={16} color="black" /> : <Eye size={16} color="black" />}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Laissez vide si vous ne voulez pas changer le mot de passe.
          </p>
        </div>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        {/* Prénom */}
        <div>
          <label className="block font-medium">Prénom</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Nom */}
        <div>
          <label className="block font-medium">Nom</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Niveau */}
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

        {/* Spécialité */}
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

        {/* Date de naissance */}
        <div>
          <label className="block font-medium">Date de naissance</label>
          <DatePicker
            selected={formData.date_of_birth ? new Date(formData.date_of_birth) : null}
            onChange={(date) =>
              setFormData({
                ...formData,
                date_of_birth: date ? date.toISOString().split("T")[0] : "",
              })
            }
            className="w-full border p-2 rounded"
            dateFormat="yyyy-MM-dd"
            placeholderText="Sélectionnez une date"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        {/* Bouton sauvegarde */}
        <button
          type="submit"
          className="bg-[#E30613] text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Sauvegarder
        </button>
        <button
        type="button"
        onClick={() => navigate("/student/dashboard")}
        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
         >
        Annuler
       </button>



      </form>
    </StudentLayout>
  );
};

export default Profile;
