// studentService.js
import pool from "../database.js"; // ton pool MySQL

export async function getStudentById(id) {
  const [rows] = await pool.query("SELECT * FROM students WHERE id = ?", [id]);
  return rows[0];
}

export async function updateStudent(id, data) {
  const {first_name, last_name, level, specialty, date_of_birth } = data;

  await pool.query(
    `UPDATE students 
     SET  first_name = ?, last_name = ?, level = ?, specialty = ? , date_of_birth = ?
     WHERE id = ?`,
    [ first_name, last_name, level, specialty,date_of_birth, id]
  );

  return getStudentById(id); 
}



export async function deleteStudent(id) {

  await pool.query(
    `delete from students 
     WHERE id = ?`,
    [ id]
  );
}


// recuper etudiant avec champs user
export async function getStudentByEmail(email) {
  const [rows] = await pool.query(
    "SELECT * FROM students S join users U on S.id= U.id WHERE email = ?", [email]
  );
  return rows;
}


export const getStudentsNumber = async() =>
{
  
    const [res] = await pool.query(
      "select count (*)  as studentsNumber from students "
    );
    return res  ;
  

};