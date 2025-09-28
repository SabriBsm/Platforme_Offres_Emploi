// toutes les requetes API
const API_URL = "http://localhost:3000/api/applications";

export const getApplicationsByStudent = async (studentId: number) => {
  const res = await fetch(`${API_URL}/student/${studentId}`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des candidatures");
  return await res.json();
};

export const getAllApplications = async () => {
  const res = await fetch(`${API_URL}`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des candidatures");
  return await res.json();
};


//supprimer une candidature
export const deleteApplication = async (applicationId: number) => {
  const res = await fetch(`${API_URL}/${applicationId}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Erreur lors de la suppression de la candidature");

  return await res.json(); // message ou données renvoyées par le back
};

export const getApplicationStats = async (studentId: number) => {
  const res = await fetch(`${API_URL}/stats/${studentId}`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des statistiques");
  return await res.json();
};


export async function getApplicationsByCompany(companyId: number): Promise<any[]> {
  const response = await fetch(`${API_URL}/company/${companyId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur lors de la récupération des candidatures.");
  }

  return response.json();
}

export const updateApplicationStatus = async (
  applicationId: number,
  status: "accepted" | "rejected"
): Promise<void> => {
  const res = await fetch(`${API_URL}/${applicationId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Erreur lors de la mise à jour du statut");
  }
};
