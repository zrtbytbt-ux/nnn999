// Simple test file to validate the server locally (optional)
// This is NOT needed for deployment, just for testing

const getFeatures = require('./netlify/functions/get-features');
const updateFeatures = require('./netlify/functions/update-features');

// Mock Netlify event
const mockGetEvent = {
    httpMethod: 'GET',
    headers: {},
    body: null
};

const mockPostEvent = {
    httpMethod: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        password: 'admin123',
        features: {
            voiceRooms: true,
            tribes: false,
            adhkar: true,
            quizzes: true
        }
    })
};

// Test get-features
async function testGet() {
    console.log('🧪 Testing GET /api/get-features...');
    try {
        const result = await getFeatures.handler(mockGetEvent, {});
        console.log('✅ Status:', result.statusCode);
        console.log('📦 Response:', JSON.parse(result.body));
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Test update-features (will fail without GitHub token)
async function testUpdate() {
    console.log('\n🧪 Testing POST /api/update-features...');
    try {
        const result = await updateFeatures.handler(mockPostEvent, {});
        console.log('✅ Status:', result.statusCode);
        console.log('📦 Response:', JSON.parse(result.body));
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Run tests
async function runTests() {
    console.log('🚀 Starting Server Tests\n');
    console.log('⚠️  Note: Update test requires GitHub Token in environment');
    console.log('━'.repeat(50));

    await testGet();
    await testUpdate();

    console.log('\n' + '━'.repeat(50));
    console.log('✨ Tests completed!\n');
}

// Uncomment to run: node test-server.js
// runTests();

module.exports = { testGet, testUpdate };
