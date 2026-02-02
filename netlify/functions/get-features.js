// Uses GitHub Gist as a simple database
// Set GITHUB_TOKEN and GIST_ID in Netlify environment variables

const https = require('https');

function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(body) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: body });
                }
            });
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const fs = require('fs');
        const path = require('path');

        // Try to read features.json from public folder
        const featuresPath = path.join(__dirname, '..', '..', 'public', 'features.json');

        let features = {
            voiceRooms: true,
            tribes: true,
            adhkar: true,
            quizzes: true
        };

        try {
            if (fs.existsSync(featuresPath)) {
                const fileContent = fs.readFileSync(featuresPath, 'utf8');
                features = JSON.parse(fileContent);
            }
        } catch (readError) {
            console.log('Using default features:', readError.message);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                features,
                lastUpdated: new Date().toISOString(),
                source: 'features-json'
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to fetch config', details: error.message })
        };
    }
};
