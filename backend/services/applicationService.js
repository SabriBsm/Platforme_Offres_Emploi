
import pool from "../database.js"; // ton pool MySQL


// Enregistrer une candidature dans la DB
export const applyToOffer = async ({ offerId, studentId, cvPath, coverLetterPath }) => {
  const [result] = await pool.query(
    `INSERT INTO applications (offer_id, student_id, cv_path, cover_letter_path) 
     VALUES (?, ?, ?, ?)`,
    [offerId, studentId, cvPath, coverLetterPath]
  );

  return { id: result.insertId, offerId, studentId, cvPath, coverLetterPath };
};






//get application par student_id
// Récupérer toutes les candidatures d'un étudiant
export const getApplicationsByStudentId = async (studentId) => {
  const [applications] = await pool.query(
    `SELECT a.*, o.title AS offer_title,o.type, c.name AS company_name, s.first_name , s.last_name
     FROM applications a
     JOIN offers o ON a.offer_id = o.id
     JOIN companies c ON c.id=o.company_id
     JOIN students s ON a.student_id = s.id
     WHERE a.student_id = ?`,
    [studentId]
  );
  return applications;
};

// Récupérer toutes les candidatures
export const getAllApplications = async () => {
  const [applications] = await pool.query(
    `SELECT a.*, o.title AS offer_title,o.type c.name AS company_name, s.first_name , s.last_name 
     FROM applications a
     JOIN offers o ON a.offer_id = o.id
     JOIN companies c ON c.id=o.company_id
     JOIN students s ON a.student_id = s.id`
  );
  return applications;
};


export const deleteApplication = async (applicationId) => {
  const [result] = await pool.query(
    `DELETE FROM applications WHERE id = ?`,
    [applicationId]
  );

  return result.affectedRows > 0; // true si la suppression a réussi
};



export const getApplicationStatsByStudent = async (studentId) => {
  const [stats] = await pool.query(
    `SELECT
       COUNT(*) AS total,
       SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
       SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END) AS accepted,
       SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected
     FROM applications
     WHERE student_id = ?`,
    [studentId]
  );
  return stats[0];
};


export const getApplicationsByCompany = async (companyId) => {
  const [applications] = await pool.query(
    `SELECT a.id, a.student_id, a.offer_id, a.status, a.cv_path, a.cover_letter_path, a.applied_at, 
            s.first_name , s.last_name , u.email ,
            o.title , o.type
     FROM applications a
     JOIN students s ON a.student_id = s.id
     JOIN offers o ON a.offer_id = o.id
     join users u on u.id = s.id
     WHERE o.company_id = ?`,
    [companyId]
  );
  return applications;
};


export const updateApplicationStatus = async (applicationId, status) => {
  const allowedStatuses = ["accepted", "rejected"];
  if (!allowedStatuses.includes(status)) {
    throw new Error("Statut invalide");
  }

  const [result] = await pool.query(
    `UPDATE applications 
     SET status = ? 
     WHERE id = ?`,
    [status, applicationId]
  );

  if (result.affectedRows === 0) {
    throw new Error("Aucune candidature trouvée avec cet ID");
  }

  return { id: applicationId, status };
};
