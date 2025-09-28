// usersService.js
import pool from "../database.js"; // ton pool MySQL
import bcrypt from "bcrypt";


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
};

export const getStudentMail = async(id) =>
{
  if(id)
  {
    const [res] = await pool.query(
      "select email from users U join students S on S.id =U.id where U.id = ?", [id]
    );
    return res ;
  }

};
export const getCompanieMail = async(id) =>
{
  if(id)
  {
    const [res] = await pool.query(
      "select email from users U join companies C on C.id =U.id where U.id = ?", [id]
    );
    return res ;
  }

};


//get users number
export const getUsersNumber = async() =>
{
  
    const [res] = await pool.query(
      "select count (*)  as usersNumber from users "
    );
    return res  ;
  

};





export const changeStudentPassword = async (id, oldPassword, newPassword) => {
  const [rows] = await pool.query("SELECT password_hash FROM users WHERE id = ?", [id]);
  if (rows.length === 0) throw new Error("Utilisateur non trouvé");

  const valid = await bcrypt.compare(oldPassword, rows[0].password_hash);
  if (!valid) throw new Error("Mot de passe actuel incorrect");

  const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hashedNewPassword, id]);

  return true;
};