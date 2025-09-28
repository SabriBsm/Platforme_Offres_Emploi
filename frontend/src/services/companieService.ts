// toutes les requetes API
const API_URL = "http://localhost:3000/api";
export interface Company {
  id: number;
  name: string;
  description: string;
  address: string;
  website: string;
}

export const getCompanies = async (): Promise<any> => {
  const res = await fetch(`${API_URL}/companies/`);
  if (!res.ok) throw new Error("Erreur pas de sociétés trouvées");
  
  const data = await res.json(); 
  return data;
  
};




export const getCompanieMail = async (id: number): Promise<string> => {
  const res = await fetch(`${API_URL}/users/companieMail/${id}`);
  if (!res.ok) throw new Error("Erreur Mail non trouvé");
  
  const data = await res.json(); 
  return data.email;
  
};
export async function updateCompanie(id: number, data: Partial<Company>) {
  const res = await fetch(`${API_URL}/companies/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur mise à jour societe");
  return res.json();
}

export async function deleteCompanie(id: number) {
  const res = await fetch(`${API_URL}/companies/${id}`, {
    method: "DELETE",
  });
if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erreur lors de la suppression de l'étudiant");
  }

  // renvoie juste un message de succès
  return res.json();
}



export async function getCompanyStats(id: number) {
  const res = await fetch(`${API_URL}/companies/${id}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, 
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erreur lors de la récupération des statistiques");
  }

  return res.json(); 
}


export const getCompanyByEmail = async (email: string): Promise<any> => {
  const res = await fetch(`${API_URL}/companies/email?email=${encodeURIComponent(email)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Erreur lors de la récupération de l'entreprise");
  }

  return res.json();
};
