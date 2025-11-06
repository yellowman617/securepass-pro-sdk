# Getting Started with SecurePass Pro SDK

Complete step-by-step guide to get started with the SecurePass Pro JavaScript SDK.

## 📋 Prerequisites

- **Enterprise or Annual Plan**: SDK access requires an Enterprise or Annual subscription
- **API Key**: You'll need an API key to authenticate requests
- **Node.js**: Version 14.0.0 or higher (for Node.js usage)
- **Modern Browser**: Latest Chrome, Firefox, Safari, or Edge (for browser usage)

## 🔑 Step 1: Get Your API Key

### Option A: From Dashboard (Recommended)

1. **Log in** to your SecurePass Pro account at [https://securepasspro.com](https://securepasspro.com)
2. Navigate to **Dashboard** → **API Integration** tab
3. Click **"Create API Key"** or **"Manage API Keys"**
4. Fill in the details:
   - **Name**: Descriptive name (e.g., "Production API Key")
   - **Description**: Optional description
   - **Permissions**: Select required permissions (default: `password_generation`, `bulk_generation`, `api_access`)
5. Click **"Create"**
6. **IMPORTANT**: Copy your API key immediately - it will only be shown once!
   - Format: `spro_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Store it securely (environment variable, secret manager, etc.)

### Option B: Via API (Enterprise Only)

If you already have API access, you can create keys programmatically:

```javascript
// POST /api/enterprise/api-keys
{
  "action": "create",
  "name": "My API Key",
  "description": "Production API key",
  "permissions": ["password_generation", "bulk_generation"]
}
```

## 📦 Step 2: Install the SDK

### Option A: NPM (Recommended for Node.js)

```bash
npm install securepass-pro-sdk
```

### Option B: CDN (For Browser)

Add to your HTML:

```html
<!-- ES Module -->
<script type="module">
  import SecurePassSDK from 'https://cdn.jsdelivr.net/npm/securepass-pro-sdk@latest/dist/securepass-sdk.esm.js';
  
  const sdk = new SecurePassSDK('spro_your-api-key-here');
</script>

<!-- Or UMD (for older browsers) -->
<script src="https://cdn.jsdelivr.net/npm/securepass-pro-sdk@latest/dist/securepass-sdk.min.js"></script>
<script>
  const sdk = new SecurePassSDK('spro_your-api-key-here');
</script>
```

### Option C: Direct Download

1. Download the SDK files from [GitHub Releases](https://github.com/securepasspro/securepass-pro-sdk/releases)
2. Choose the format you need:
   - `securepass-sdk.js` - UMD (Universal Module Definition)
   - `securepass-sdk.esm.js` - ES Module
   - `securepass-sdk.min.js` - Minified UMD
3. Include in your project:

```html
<!-- ES Module -->
<script type="module">
  import SecurePassSDK from './lib/securepass-sdk.esm.js';
</script>

<!-- Or UMD -->
<script src="./lib/securepass-sdk.js"></script>
```

## 🚀 Step 3: Initialize the SDK

### Node.js / CommonJS

```javascript
const SecurePassSDK = require('securepass-pro-sdk');

const sdk = new SecurePassSDK('spro_your-api-key-here', {
  baseURL: 'https://securepasspro.com/api', // Optional: custom API URL
  timeout: 10000 // Optional: request timeout in ms
});
```

### ES Modules

```javascript
import SecurePassSDK from 'securepass-pro-sdk';

const sdk = new SecurePassSDK('spro_your-api-key-here');
```

### Browser (ES Module)

```javascript
import SecurePassSDK from './lib/securepass-sdk.esm.js';

const sdk = new SecurePassSDK('spro_your-api-key-here');
```

### Browser (UMD)

```html
<script src="./lib/securepass-sdk.js"></script>
<script>
  const sdk = new SecurePassSDK('spro_your-api-key-here');
</script>
```

## ✅ Step 4: Test Your Connection

Always test your connection first:

```javascript
async function testConnection() {
  try {
    const result = await sdk.testConnection();
    
    if (result.success) {
      console.log('✅ API connection successful!');
      console.log('User:', result.data.user.email);
      console.log('Plan:', result.data.user.plan);
      console.log('API Key ID:', result.data.apiKey.id);
    } else {
      console.error('❌ Connection failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testConnection();
```

## 🎯 Step 5: Generate Your First Password

### Basic Password Generation

```javascript
async function generatePassword() {
  try {
    const result = await sdk.generatePassword({
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true
    });
    
    console.log('Password:', result.password);
    console.log('Strength:', result.strength);
    console.log('Entropy:', result.entropy);
    console.log('Quantum Resistant:', result.quantumResistant);
    console.log('Quota Remaining:', result.quota?.remaining);
  } catch (error) {
    console.error('Error generating password:', error.message);
  }
}

generatePassword();
```

### Generate Bulk Passwords

```javascript
async function generateBulkPasswords() {
  try {
    const result = await sdk.generateBulkPasswords(10, {
      length: 16
    });
    
    console.log(`Generated ${result.count} passwords:`);
    result.passwords.forEach((password, index) => {
      console.log(`${index + 1}. ${password}`);
    });
    
    console.log('Quota Remaining:', result.quota?.remaining);
  } catch (error) {
    console.error('Error generating bulk passwords:', error.message);
  }
}

generateBulkPasswords();
```

## 📊 Step 6: Check Your Usage

Monitor your API usage:

```javascript
async function checkUsage() {
  try {
    const usage = await sdk.getUsage();
    
    console.log('Plan:', usage.plan);
    console.log('Used:', usage.usedGenerations);
    console.log('Limit:', usage.passwordLimit);
    console.log('Remaining:', usage.passwordLimit - usage.usedGenerations);
    console.log('Quota Remaining:', usage.apiKey?.quotaRemaining);
  } catch (error) {
    console.error('Error getting usage:', error.message);
  }
}

checkUsage();
```

## 🛡️ Step 7: Handle Errors Properly

Always implement proper error handling:

```javascript
async function generatePasswordSafely() {
  try {
    const result = await sdk.generatePassword({ length: 16 });
    return result.password;
  } catch (error) {
    // Handle specific error types
    if (error.message.includes('401')) {
      console.error('❌ Authentication failed. Check your API key.');
    } else if (error.message.includes('429')) {
      console.error('❌ Rate limit exceeded. Please try again later.');
    } else if (error.message.includes('403')) {
      console.error('❌ Access denied. Check your plan and permissions.');
    } else if (error.message.includes('timeout')) {
      console.error('❌ Request timeout. Check your network connection.');
    } else {
      console.error('❌ Unexpected error:', error.message);
    }
    throw error; // Re-throw if needed
  }
}
```

## 🔒 Security Best Practices

1. **Never expose API keys** in client-side code or public repositories
2. **Use environment variables** for API keys:
   ```javascript
   const sdk = new SecurePassSDK(process.env.SECUREPASS_API_KEY);
   ```
3. **Rotate API keys regularly** (every 90 days recommended)
4. **Use different keys** for different environments (dev, staging, production)
5. **Monitor usage** regularly to detect unauthorized access
6. **Revoke compromised keys** immediately

## 📝 Complete Example

Here's a complete working example:

```javascript
import SecurePassSDK from 'securepass-pro-sdk';

// Initialize SDK
const sdk = new SecurePassSDK(process.env.SECUREPASS_API_KEY);

async function main() {
  try {
    // Test connection
    console.log('Testing connection...');
    const test = await sdk.testConnection();
    if (!test.success) {
      throw new Error('Connection test failed');
    }
    console.log('✅ Connected successfully!');
    
    // Check usage
    console.log('\nChecking usage...');
    const usage = await sdk.getUsage();
    console.log(`Plan: ${usage.plan}`);
    console.log(`Used: ${usage.usedGenerations}/${usage.passwordLimit}`);
    
    // Generate password
    console.log('\nGenerating password...');
    const password = await sdk.generatePassword({
      length: 20,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true
    });
    console.log(`Generated: ${password.password}`);
    console.log(`Strength: ${password.strength}`);
    console.log(`Quota remaining: ${password.quota?.remaining}`);
    
    // Generate bulk passwords
    console.log('\nGenerating bulk passwords...');
    const bulk = await sdk.generateBulkPasswords(5, { length: 16 });
    console.log(`Generated ${bulk.count} passwords:`);
    bulk.passwords.forEach((pwd, i) => {
      console.log(`  ${i + 1}. ${pwd}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
```

## 🆘 Troubleshooting

### "Invalid API key provided"
- Ensure your API key starts with `spro_`
- Check that the API key is at least 40 characters
- Verify you copied the complete key

### "Authentication required"
- Verify your API key is correct
- Check that your account has Enterprise or Annual plan
- Ensure the API key is active (not revoked)

### "Rate limit exceeded"
- You've exceeded your plan's rate limit
- Wait before making more requests
- Consider upgrading to Enterprise plan for higher limits

### "Request timeout"
- Check your network connection
- Increase timeout in SDK options:
  ```javascript
  const sdk = new SecurePassSDK('your-key', { timeout: 30000 });
  ```

### "Enterprise plan required"
- SDK access requires Enterprise or Annual plan
- Upgrade your plan to use the SDK

## 📚 Next Steps

- Read the [Full API Reference](./README.md#api-reference)
- Check out [Usage Examples](./README.md#examples)
- Explore [Team Management](./README.md#team-management)
- Review [Security Features](./README.md#security-features)

## 🆘 Need Help?

- **Documentation**: [https://securepasspro.com/docs](https://securepasspro.com/docs)
- **API Reference**: [https://securepasspro.com/api-docs](https://securepasspro.com/api-docs)
- **Support**: [support@securepasspro.com](mailto:support@securepasspro.com)
- **GitHub Issues**: [https://github.com/securepasspro/securepass-pro-sdk/issues](https://github.com/securepasspro/securepass-pro-sdk/issues)

---

**Ready to build?** Start generating secure passwords with the most secure password generator SDK! 🚀

