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

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const githubToken = process.env.GITHUB_TOKEN;
        const gistId = process.env.GIST_ID;
        const body = JSON.parse(event.body);
        const { password, features } = body;

        if (!githubToken || !gistId) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'GitHub not configured. Set GITHUB_TOKEN and GIST_ID in environment variables.'
                })
            };
        }

        // Get current gist
        const getOptions = {
            hostname: 'api.github.com',
            path: `/gists/${gistId}`,
            method: 'GET',
            headers: {
                'User-Agent': 'Netlify-Function',
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const getResponse = await makeRequest(getOptions);

        if (getResponse.status !== 200) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to fetch current config' })
            };
        }

        // Get current config
        const configFile = getResponse.data.files['config.json'];
        const config = configFile ? JSON.parse(configFile.content) : {};

        // Verify password
        const correctPassword = config.password || process.env.ADMIN_PASSWORD || 'admin123';
        if (password !== correctPassword) {
            return {
                statusCode: 401,
                headers,
                body: JSON.stringify({ error: 'كلمة السر غير صحيحة' })
            };
        }

        // Update config
        const updatedConfig = {
            password: correctPassword,
            features,
            lastUpdated: new Date().toISOString()
        };

        // Update gist
        const updateOptions = {
            hostname: 'api.github.com',
            path: `/gists/${gistId}`,
            method: 'PATCH',
            headers: {
                'User-Agent': 'Netlify-Function',
                'Authorization': `token ${githubToken}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };

        const updateData = {
            files: {
                'config.json': {
                    content: JSON.stringify(updatedConfig, null, 2)
                }
            }
        };

        const updateResponse = await makeRequest(updateOptions, updateData);

        if (updateResponse.status === 200) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'تم التحديث بنجاح',
                    features: updatedConfig.features,
                    lastUpdated: updatedConfig.lastUpdated
                })
            };
        } else {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Failed to update config' })
            };
        }

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'فشل حفظ التغييرات', details: error.message })
        };
    }
};
