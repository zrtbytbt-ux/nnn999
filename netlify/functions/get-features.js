const https = require('https');

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
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
        // Default features
        let features = {
            voiceRooms: true,
            tribes: true,
            adhkar: true,
            quizzes: true
        };

        // Try to fetch from public features.json
        try {
            const publicUrl = `https://${event.headers.host}/features.json`;
            features = await fetchJson(publicUrl);
        } catch (fetchError) {
            console.log('Using default features:', fetchError.message);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                features,
                lastUpdated: new Date().toISOString(),
                source: 'cdn'
            })
        };

    } catch (error) {
        // Fallback to defaults
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                features: {
                    voiceRooms: true,
                    tribes: true,
                    adhkar: true,
                    quizzes: true
                },
                lastUpdated: new Date().toISOString(),
                source: 'default'
            })
        };
    }
};
