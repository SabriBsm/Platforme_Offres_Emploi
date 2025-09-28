// studentService.js
import pool from "../database.js"; // ton pool MySQL

export async function getCompanieById(id) {
  const [rows] = await pool.query("SELECT * FROM companies WHERE id = ?", [id]);
  return rows[0];
}


export async function updateCompanie(id, data) {
  const {name, description, address, website } = data;

  await pool.query(
    `UPDATE companies 
     SET  name = ?, description = ?, address = ?, website = ? 
     WHERE id = ?`,
    [ name, description, address, website, id]
  );

  return getCompanieById(id); // retourne la version mise à jour
}


export async function deleteCompany(id) {

  await pool.query(
    `delete from companies 
     WHERE id = ?`,
    [ id]
  );
}




export async function getCompanyDashboardStats(companyId) {
  try {
    // Nombre total d'offres publiées
    const [offers] = await pool.query(
      `SELECT COUNT(*) AS totalOffers
       FROM offers
       WHERE company_id = ?`,
      [companyId]
    );

    // Nombre total de candidatures reçues + statut
    const [applications] = await pool.query(
      `SELECT COUNT(*) AS totalApplications,
              SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pendingApplications,
              SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS acceptedApplications
       FROM applications
       JOIN offers ON applications.offer_id = offers.id
       WHERE offers.company_id = ?`,
      [companyId]
    );

    return {
      totalOffers: offers[0]?.totalOffers || 0,
      totalApplications: applications[0]?.totalApplications || 0,
      pendingApplications: applications[0]?.pendingApplications || 0,
      acceptedApplications: applications[0]?.acceptedApplications || 0,
    };
  } catch (error) {
    console.error("Erreur getCompanyDashboardStats:", error);
    throw error;
  }
}


export async function getCompanyByEmail(email) {
  const [rows] = await pool.query(
    `SELECT * FROM companies C join users U on C.id=U.id WHERE u.email = ?`,
    [email]
  );
  return rows[0];
}
export const getCompaniesNumber = async() =>
{
  
    const [res] = await pool.query(
      "select count (*)  as companiesNumber from companies "
    );
    return res  ;
  

};