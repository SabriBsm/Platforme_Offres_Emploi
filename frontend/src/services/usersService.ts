// toutes les requetes API
const API_URL = "http://localhost:3000/api";

interface ChangePasswordData {
  old_password: string;
  new_password: string;
}
import { getToken } from "./authService";

//getUsers
export const getUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Erreur récupération utilisateurs");
  return res.json();
};


// create user
export const createUser = async (userData: any) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await res.json();

  if (!res.ok) {
    // le backend renvoie { success: false, message: "❌ Cet email existe déjà" }
    throw new Error(data.message || "Erreur ajout utilisateur");
  }

  return data; // { success, message, user }
};


// update user
export const updateUser = async (id: number, userData: any) => {
  const res = await fetch(`${API_URL}/users/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
   const data = await res.json();

  if (!res.ok) {
    // le backend renvoie { success: false, message: "❌ Cet email existe déjà" }
    throw new Error(data.message || "Erreur modif utilisateur");
  }

  return data; // { success, message, user }
  
};


//getstudent
export const getStudent = async (id: number) => {
  const res = await fetch(`${API_URL}/students/student/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Erreur récupération étudiant");
  return res.json(); // retourne les champs spécifiques student
};

//get company
export const getCompany = async (id: number) => {
  const res = await fetch(`${API_URL}/companies/company/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) throw new Error("Erreur récupération entreprise");
  return res.json(); // retourne les champs spécifiques company
};

// delete user

export const deleteUser = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }

    return await response.json();
  } catch (error) {
    console.error("deleteUser error:", error);
    throw error;
  }
};


// rechercher un user par e-mail
// services/usersService.ts
interface User {
  id: number;
  email: string;
  role: "admin" | "company" | "student";
  created_at: string;
  is_verified : boolean;
  updated_at : string;
  verification_token : string;
  password_hash : string;
}

export const searchUsersByEmail = async (email: string = ""): Promise<User[]> => {
  const url = email ? `${API_URL}/users?email=${email}` :`${API_URL}/users`;
  // const url = email ? `API_URL/users?email=${email}` : "API_URL/users";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
  return await res.json();
};


// get nombre de users
export const getUsersNumber = async () => {

  // const url = email ? `API_URL/users?email=${email}` : "API_URL/users";
  const res = await fetch(`${API_URL}/users/users/number`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des utilisateurs");
  return await res.json();
};


//changer password student

export const changeUserPassword = async (
  data: ChangePasswordData
): Promise<{ message: string }> => {
  const token = getToken();

  const res = await fetch(`${API_URL}/users/change-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.error || "Erreur modification mot de passe");
  }

  return result;
};

