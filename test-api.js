const http = require('http');

const BASE_URL = 'http://localhost:3000';

// Test 1: Health check
function testHealthCheck() {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}/`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('✓ Health Check:', JSON.parse(data));
        resolve();
      });
    });
    req.on('error', reject);
  });
}

// Test 2: Register Driver
function testRegisterDriver() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: 'John Driver',
      phone: '1234567890',
      password: 'password123',
      roles: ['driver'],
      activeRole: 'driver',
      extraData: {
        vehicle: 'Toyota Camry'
      }
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('✓ Register Driver:', JSON.parse(data));
        resolve();
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Test 3: Register Restaurant
function testRegisterRestaurant() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: 'Pizza Palace Owner',
      phone: '9876543210',
      password: 'password123',
      roles: ['restaurant'],
      activeRole: 'restaurant',
      extraData: {
        restaurantName: 'Pizza Palace',
        lat: 40.7128,
        lng: -74.0060
      }
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('✓ Register Restaurant:', JSON.parse(data));
        resolve();
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Test 4: Register User with Multiple Roles
function testRegisterMultipleRoles() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: 'Multi Role User',
      phone: '5555555555',
      password: 'password123',
      roles: ['driver', 'restaurant'],
      activeRole: 'driver',
      extraData: {
        vehicle: 'Honda Civic',
        restaurantName: 'Burger King',
        lat: 40.7580,
        lng: -73.9855
      }
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('✓ Register Multiple Roles:', JSON.parse(data));
        resolve();
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Test 5: Invalid Request (Missing Fields)
function testInvalidRequest() {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      name: 'Test User',
      phone: '1111111111'
      // Missing password, roles, activeRole
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log('✓ Invalid Request Test:', JSON.parse(data));
        resolve();
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Run all tests
async function runTests() {
  console.log('Starting API Tests...\n');
  
  try {
    await testHealthCheck();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testRegisterDriver();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testRegisterRestaurant();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testRegisterMultipleRoles();
    await new Promise(resolve => setTimeout(resolve, 500));
    
    await testInvalidRequest();
    
    console.log('\n✓ All tests completed!');
  } catch (error) {
    console.error('✗ Test failed:', error.message);
  }
}

runTests();

