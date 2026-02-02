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
        const githubToken = process.env.GITHUB_TOKEN;
        const gistId = process.env.GIST_ID;

        if (!githubToken || !gistId) {
            // Fallback to default values if GitHub not configured
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

        // Fetch from GitHub Gist
        const options = {
            hostname: 'api.github.com',
            path: `/gists/${gistId}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Netlify-Function',
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const response = await makeRequest(options);

        if (response.status === 200) {
            const configFile = response.data.files['config.json'];
            if (configFile && configFile.content) {
                const config = JSON.parse(configFile.content);
                const { password, ...publicData } = config;
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(Object.assign({}, publicData, { source: 'github-gist' }))
                };
            }
        }

        // Fallback
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
                source: 'fallback'
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
