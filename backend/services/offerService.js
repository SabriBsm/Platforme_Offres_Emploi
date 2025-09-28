// usersService.js
import pool from "../database.js"; // ton pool MySQL

/*
export const getUsersFromDB = async (email) => {
  if (email) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email LIKE ?",
      [`%${email}%`]
    );
    return rows;
  } else {
    const [rows] = await pool.query("SELECT * FROM users");
    return rows;
  }
};*/


/*
export const getStudentMail = async(id) =>
{
  if(id)
  {
    const [res] = await pool.query(
      "select email from users U join students S on S.id =U.id where U.id = ?", [id]
    );
    return res ;
  }

};*/
export const createOffer = async (offerData) => {
  try {
    const [result] = await pool.query(
      "INSERT INTO offers (title, description, company_id, location, type, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [offerData.title, offerData.description, offerData.company_id, offerData.location, offerData.type, offerData.start_date, offerData.end_date]
    );

    return {
      id: result.insertId,
      ...offerData,
    };
  } catch (err) {
    throw new Error("Erreur lors de la création de l’offre : " + err.message);
  }
};
export const getOfferById = async(id) =>
{
  const [offer] = await pool.query(
    "select * from offers where id = ?",
    [id]
  )
  return offer[0];
}

export const updateOffer = async (id, offerData) => {
  try {
    const [result] = await pool.query(
      "update offers set title = ? , description  = ? , company_id  = ? , location  = ? , type = ? , start_date = ? , end_date = ?  where id = ?",
      [offerData.title, offerData.description, offerData.company_id, offerData.location, offerData.type, offerData.start_date, offerData.end_date , id]
    );
  if (result.affectedRows === 0) {
      throw new Error("Aucune offre trouvée avec cet ID.");
    }
    return (await getOfferById(id) );
  } catch (err) {
    throw new Error("Erreur lors de la MAJ de l’offre : " + err.message);
  }
};


export const deleteOffer = async (id) => {
  try
  {
    await pool.query(
    "delete from offers where id = ?",
    [id]
    );
  }
  catch(err)
  {
    throw new Error("erreur lors de suppression " +err.message);
  }


}

//get offers number
export const getOffersNumber = async() =>
{
  
    const [res] = await pool.query(
      "select count (*) as offersNumber from offers "
    );
    return res ;
  

};


//get offers by company id

export const getOffersByCompany = async (companyId) => {
  const [rows] = await pool.query(
    "SELECT * FROM offers WHERE company_id = ?",
    [companyId]
  );
  console.log(companyId);
  return rows;
};


