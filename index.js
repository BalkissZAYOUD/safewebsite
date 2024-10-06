const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors'); // Importer le middleware CORS
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Utiliser le middleware CORS
app.use(bodyParser.json());

// Route for the root ("/")
app.get('/', (req, res) => {
    res.send('Welcome to the URL Phishing Detection API. Use POST /analyze to analyze URLs.');
});

// POST route to analyze URLs
app.post('/analyze', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const apiKey = process.env.VIRUSTOTAL_API_KEY;

        // Make a request to VirusTotal's API
        const response = await axios.get(`https://www.virustotal.com/vtapi/v2/url/report`, {
            params: {
                apikey: apiKey,
                resource: url
            }
        });

        // Check the response and return the analysis result
        const data = response.data;

        if (data.positives > 0) {
            return res.json({ message: 'Warning! This URL is potentially dangerous.' });
        } else {
            return res.json({ message: 'This URL appears safe.' });
        }
    } catch (error) {
        console.error('Error analyzing the URL:', error);
        return res.status(500).json({ message: 'Error analyzing the URL' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
