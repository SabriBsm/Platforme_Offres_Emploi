// toutes les requetes API
const API_URL = "http://localhost:3000/api";
import type {OfferFormData} from "../pages/company/offerForm";

export const getCompanieName = async (id: number): Promise<any> => {
  const res = await fetch(`${API_URL}/companies/company/${id}`);
  if (!res.ok) throw new Error("Erreur entreprise non trouvé");
  
  const data = await res.json(); 
  return data.name;
}

export const getCompanies = async (): Promise<any> => {
  const res = await fetch(`${API_URL}/companies/`);
  if (!res.ok) throw new Error("Erreur pas de sociétés trouvées");
  
  const data = await res.json(); 
  return data;
  
};

//create offer
export const createOffer = async (offerData: any ) => {

  const res = await fetch(`${API_URL}/offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offerData),
  });
  if (!res.ok) throw new Error("Erreur ajout de l'offre");
  return res.json(); 


};

export const createOfferCompany = async (data: OfferFormData & { company_id: number }) => {
  const res = await fetch(`${API_URL}/offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Erreur lors de la création de l'offre");
  return res.json();
};


//update offer
export const updateOffer = async (id :number, offerData: any) => {

  const res = await fetch(`${API_URL}/offers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(offerData),
  });
  if (!res.ok) throw new Error("Erreur MAJ de l'offre");
  return res.json(); 

};


export const updateOfferCompany = async (
  id: number,
  offerData: OfferFormData,
  company_id: number
) => {
  const res = await fetch(`${API_URL}/offers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...offerData,
      company_id,
    }),
  });

  if (!res.ok) throw new Error("Erreur MAJ de l'offre");
  return res.json();
};


//getoffers
export const getOffers = async () => {
const res = await fetch(`${API_URL}/offers/`);
if (!res.ok) throw new Error ("erreur de chargement des offres");
return res.json();

};

//delete offer
export const deleteOffer = async (id: number) => {
try {

  const response = await fetch(`${API_URL}/offers/${id}` ,{
  method :"DELETE",
});
 if (!response.ok) {
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }

    return await response.json();
  
}
catch (error) {
    console.error("deleteUser error:", error);
    throw error;
  }

};

// get nombre des offres
export const getOffersNumber = async () => {

 
  const res = await fetch(`${API_URL}/offers/offers/number`);
  if (!res.ok) throw new Error("Erreur lors de la récupération des offres");
  return await res.json();
};


// getValidOffers
export const getValidOffers = async () => {
  try {
    const offers = await getOffers();

    const today = new Date();

    const validOffers = offers.filter((offer: any) => {
      if (!offer.start_date) return false;

      const startDate = new Date(offer.start_date);
      console.log("start_date", offer.start_date, "→", new Date(offer.start_date));


      // date_debut - 7 jours
      const startMinus7 = new Date(startDate);
      startMinus7.setDate(startMinus7.getDate() - 7);

      return startMinus7 >= today;
    });

    return validOffers;
  } catch (error) {
    console.error("Erreur chargement des offres valides:", error);
    throw error;
  }
};

// Récupérer une offre par ID
export const getOfferById = async (id: number) => {
  const res = await fetch(`${API_URL}/offers/${id}`);
  if (!res.ok) throw new Error("Erreur lors du chargement de l'offre");
  return await res.json();
};

// Postuler à une offre (candidature)
export const applyToOffer = async (formData: FormData) => {
  const res = await fetch(`${API_URL}/applications/apply`, {
    method: "POST",
    body: formData, 
  });

  if (!res.ok) throw new Error("Erreur lors de l'envoi de la candidature");
  return await res.json();
};

export const getCompanyDashboardStats = async (companyId: number): Promise<any> => {
  const res = await fetch(`/api/companies/${companyId}/dashboard`);
  if (!res.ok) throw new Error("Erreur API");
  return res.json();
};



export const getOffersByCompany = async (companyId: number) => {
  const res = await fetch(`${API_URL}/offers/company/${companyId}`);
  if (!res.ok) throw new Error("Erreur lors du chargement des offres");
  return res.json();
};
