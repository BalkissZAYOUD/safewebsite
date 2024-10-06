const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware pour servir des fichiers statiques (comme index.html)
app.use(express.static(path.join(__dirname, 'C:\Users\balkis\Downloads\transitive-master\chatbot_security\chatbot_security\public'))); // Assurez-vous que 'public' est le bon dossier

// Route par défaut pour renvoyer index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'C:\Users\balkis\Downloads\transitive-master\chatbot_security\chatbot_security\public', 'index3.html'));
});

// Démarre le serveur
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
