const fetch = require('node-fetch');

async function testAdminAPI() {
  try {
    console.log('🧪 Testing admin enterprises API...');
    
    // First login as admin to get auth cookie
    const loginResponse = await fetch('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@gmail.com',
        password: 'Admin@123'
      }),
    });

    if (!loginResponse.ok) {
      console.error('❌ Admin login failed:', await loginResponse.text());
      return;
    }

    console.log('✅ Admin login successful');
    
    // Extract cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('🍪 Cookies:', cookies);

    // Test enterprises API
    const enterprisesResponse = await fetch('http://localhost:3000/api/admin/enterprises', {
      headers: {
        'Cookie': cookies
      }
    });

    if (!enterprisesResponse.ok) {
      console.error('❌ Enterprises API failed:', await enterprisesResponse.text());
      return;
    }

    const enterprisesData = await enterprisesResponse.json();
    console.log('📊 Enterprises API response:', JSON.stringify(enterprisesData, null, 2));

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAdminAPI();