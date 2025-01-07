// routes/authRoutes.js

const express = require('express');
const axios = require('axios'); // Importez axios pour les requêtes HTTP
const router = express.Router();
// Route pour ChatGPT
router.post('/chatgpt', async (req, res) => {
    
    const message = req.body.command;
    if (!message) return res.status(400).json({ error: 'Message manquant' });
    
    try {
        // Step 1: Retrieve a session ID from the API
        const sessionResponse = await axios.post('https://aibot-nu.vercel.app/session', {}, {
            headers: { 'Content-Type': 'application/json' }
        });
        
        const sessionId = sessionResponse.data.sessionId;
        console.log(sessionId);
        if (!sessionId) return res.status(500).json({ error: 'Erreur lors de la création de la session.' });

        // Step 2: Send the message using the obtained session ID
        const response = await axios.post('https://aibot-nu.vercel.app/prompts', {
            userMessage: message,
            sessionId: sessionId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({ response: response.data }); // Assuming the API response is in response.data
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la communication avec l\'API AiBot.' });
    }
});


// Exporter le routeur
module.exports = router;
