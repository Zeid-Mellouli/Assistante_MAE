const sqlite3 = require('sqlite3').verbose();  // Importer le module SQLite3
const path = require('path');

// Créer ou ouvrir la base de données
const db = new sqlite3.Database(path.join(__dirname, 'database.db'), (err) => {
  if (err) {
    console.error('Erreur lors de la création de la base de données:', err);
  } else {
    console.log('Base de données créée ou ouverte avec succès');
  }
});


module.exports = { db };
