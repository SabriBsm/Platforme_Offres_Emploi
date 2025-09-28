import mysql from 'mysql2';

// Création d'un pool de connexions
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'SabriTab',
  database: 'esprit_job_platform',
  waitForConnections: true,  // attend si toutes les connexions sont utilisées
  connectionLimit: 10,       // nombre max de connexions simultanées
  queueLimit: 0              // 0 = file d’attente illimitée
});

// Test de connexion
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur de connexion MySQL :', err.message);
  } else {
    console.log('✅ Connecté à la base de données MySQL');
    connection.release(); // libérer la connexion après le test
  }
});

export default pool.promise();
