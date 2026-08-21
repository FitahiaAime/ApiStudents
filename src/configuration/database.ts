import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Validation des variables essentielles
const requiredVars = ['DB_USER', 'DB_NAME', 'DB_PASSWORD'];
const missing = requiredVars.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.warn(`⚠️ Variables d\'environnement manquantes: ${missing.join(', ')}`);
  console.warn('⚠️ Utilisation des valeurs par défaut');
}

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'students',      // ✅ students par défaut
  password: process.env.DB_PASSWORD || '',          // ✅ Pas de mot de passe par défaut
  port: parseInt(process.env.DB_PORT || '5432', 10),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Gestion des erreurs
pool.on('error', (err) => {
  console.error('❌ Erreur inattendue du pool PostgreSQL:', err.message);
});

// Test de connexion au démarrage
(async function testConnection() {
  let client;
  try {
    client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time');
    console.log(`✅ PostgreSQL connecté - Heure serveur: ${result.rows[0].current_time}`);
  } catch (err) {
    console.error('❌ Erreur de connexion PostgreSQL:', err instanceof Error ? err.message : err);
    console.error('💡 Vérifiez vos identifiants dans .env');
    process.exit(1);
  } finally {
    if (client) client.release();
  }
})();

export default pool;