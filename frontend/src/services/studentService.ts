// toutes les requetes API
const API_URL = "http://localhost:3000/api";


export interface Student {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  university: string;
  level: string;
  specialty: string;
  date_of_birth?: string;
}
export const getStudentMail = async (id: number): Promise<string> => {
  const res = await fetch(`${API_URL}/users/${id}`);
  if (!res.ok) throw new Error("Erreur Mail non trouvé");
  
  const data = await res.json(); 
  return data.email;
  
};


export async function updateStudent(id: number, data: Partial<Student>) {
  const res = await fetch(`${API_URL}/students/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur mise à jour étudiant");
  return res.json();
}

export async function deleteStudent(id: number) {
  const res = await fetch(`${API_URL}/students/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erreur lors de la suppression de l'étudiant");
  }

  // renvoie juste un message de succès
  return res.json();
}




// getstudent avec les champs users
export const getStudentByEmail = async (email: string): Promise<Student> => {
  const res = await fetch(`${API_URL}/students/studentByEmail?email=${email}`);
  if (!res.ok) throw new Error("Erreur Mail non trouvé");
  
  const data = await res.json(); 
  return data;
  
};


//changer 