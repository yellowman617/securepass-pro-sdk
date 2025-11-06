# SecurePass Pro JavaScript SDK

[![npm version](https://badge.fury.io/js/securepass-pro-sdk.svg)](https://badge.fury.io/js/securepass-pro-sdk)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Security](https://img.shields.io/badge/Security-Cryptographically%20Secure-brightgreen.svg)](https://securepasspro.co)

Official JavaScript SDK for SecurePass Pro - The most secure password generator with cryptographically secure 256-bit encryption and zero-storage architecture.

## 🚀 Features

- ✅ **Cryptographically Secure** - 256-bit encryption & CSPRNG
- ✅ **Zero Storage** - Passwords never stored on servers
- ✅ **Bulk Generation** - Generate up to 1000 passwords at once
- ✅ **Team Management** - Add, remove, and manage team members
- ✅ **Usage Tracking** - Monitor password generation limits
- ✅ **Cross-Platform** - Works in Node.js and browsers
- ✅ **TypeScript Support** - Full type definitions included
- ✅ **Enterprise Ready** - Role-based access control

## 📦 Installation

### NPM (Recommended)

```bash
npm install securepass-pro-sdk
```

### CDN (Browser)

```html
<!-- ES Module -->
<script type="module">
  import SecurePassSDK from 'https://cdn.jsdelivr.net/npm/securepass-pro-sdk@latest/dist/securepass-sdk.esm.js';
</script>

<!-- UMD (for older browsers) -->
<script src="https://cdn.jsdelivr.net/npm/securepass-pro-sdk@latest/dist/securepass-sdk.min.js"></script>
```

### Direct Download

Download from [GitHub Releases](https://github.com/securepasspro/securepass-pro-sdk/releases) and include in your project.

### 🔑 Get Your API Key

1. Log in to [SecurePass Pro Dashboard](https://securepasspro.com)
2. Go to **API Integration** tab
3. Click **"Create API Key"**
4. Copy your API key (only shown once!)
5. Store it securely (environment variable, secret manager, etc.)

**📖 Full setup instructions:** See [GETTING_STARTED.md](./GETTING_STARTED.md)

## 🎯 Quick Start

```javascript
import SecurePassSDK from 'securepass-pro-sdk';

// Initialize with your API key
const sdk = new SecurePassSDK('spro_your-api-key-here');

// Test connection first
const test = await sdk.testConnection();
console.log(test.success); // true

// Generate a secure password
const result = await sdk.generatePassword({ length: 16 });
console.log(result.password); // Your generated password
console.log(result.strength); // 'strong'
console.log(result.quota?.remaining); // Remaining quota
```

**📖 Complete getting started guide:** [GETTING_STARTED.md](./GETTING_STARTED.md)

## 📋 API Reference

### Constructor

```javascript
const sdk = new SecurePassSDK(apiKey, options);
```

**Parameters:**
- `apiKey` (string, required): Your SecurePass Pro API key (must start with `spro_` and be at least 40 characters)
- `options` (object, optional):
  - `baseURL` (string): Custom API URL (default: auto-detected from browser or `https://securepasspro.com/api`)
  - `timeout` (number): Request timeout in ms (default: `10000`)

**⚠️ Important:**
- API key must start with `spro_` prefix
- Requires Enterprise or Annual plan
- Store API keys securely - never expose in client-side code

### Methods

#### `generatePassword(options)`
Generate a single secure password.

**Options:**
- `length` (number): Password length, 8-64 characters (default: 16)
- `includeUppercase` (boolean): Include uppercase letters (default: true)
- `includeLowercase` (boolean): Include lowercase letters (default: true)
- `includeNumbers` (boolean): Include numbers (default: true)
- `includeSymbols` (boolean): Include symbols (default: true)

**Returns:**
```javascript
{
  success: true,
  password: string,
  length: number,
  strength: 'weak' | 'medium' | 'strong' | 'ultra-complex' | 'ultimate-complexity' | 'maximum-complexity',
  entropy: number,
  complexity: string,
  quantumResistant: boolean,
  timestamp: string,
  quota: {
    remaining: number,
    apiKeyId: string
  }
}
```

**Example:**
```javascript
const result = await sdk.generatePassword({
  length: 20,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true
});

console.log(result.password); // Generated password
console.log(result.strength); // 'strong'
console.log(result.quota?.remaining); // Remaining quota
```

#### `generateBulkPasswords(count, options)`
Generate multiple passwords (up to 1000).

**Parameters:**
- `count` (number): Number of passwords to generate (1-1000)
- `options` (object): Same as `generatePassword()` options

**Returns:**
```javascript
{
  success: true,
  count: number,
  passwords: string[],
  length: number,
  timestamp: string,
  quota: {
    remaining: number,
    apiKeyId: string
  }
}
```

**Example:**
```javascript
const result = await sdk.generateBulkPasswords(10, {
  length: 16
});

console.log(result.passwords); // Array of 10 passwords
console.log(result.count); // 10
console.log(result.quota?.remaining); // Remaining quota
```

#### `getTeamInfo(teamId)`
Get team information and member list.

```javascript
const teamInfo = await sdk.getTeamInfo('team_12345');
console.log(teamInfo.team.members); // Team members
```

#### `addTeamMember(teamId, email, role)`
Add a new member to your team.

```javascript
const result = await sdk.addTeamMember('team_12345', 'user@company.com', 'member');
```

#### `removeTeamMember(teamId, email)`
Remove a member from your team.

```javascript
const result = await sdk.removeTeamMember('team_12345', 'user@company.com');
```

#### `updateTeamMemberRole(teamId, email, role)`
Update a team member's role.

```javascript
const result = await sdk.updateTeamMemberRole('team_12345', 'user@company.com', 'admin');
```

#### `getUsage()`
Get your current usage statistics.

**Returns:**
```javascript
{
  name: string,
  email: string,
  plan: 'Basic' | 'Pro' | 'Enterprise' | 'Annual',
  nextBillingDate: string,
  passwordLimit: number,
  randomizationCount: number,
  usedGenerations: number,
  signupDate: string,
  billingCycle: 'monthly' | 'annual',
  amount: number,
  apiKey: {
    quotaRemaining: number,
    apiKeyId: string
  }
}
```

**Example:**
```javascript
const usage = await sdk.getUsage();
console.log(usage.plan); // 'Enterprise'
console.log(usage.usedGenerations); // Passwords used this month
console.log(usage.passwordLimit); // Total limit
console.log(usage.apiKey?.quotaRemaining); // Remaining API quota
```

#### `testConnection()`
Test API connection and authentication.

**Returns:**
```javascript
{
  success: boolean,
  message: string,
  data?: {
    success: boolean,
    message: string,
    timestamp: string,
    user: {
      email: string,
      plan: string
    },
    apiKey: {
      id: string,
      permissions: string[]
    },
    version: string
  }
}
```

**Example:**
```javascript
const test = await sdk.testConnection();
if (test.success) {
  console.log('✅ Connection successful!');
  console.log('User:', test.data.user.email);
  console.log('Plan:', test.data.user.plan);
} else {
  console.error('❌ Connection failed:', test.message);
}
```

## 🔒 Security Features

- **Input Validation** - All inputs are validated and sanitized
- **Request Timeout** - 10-second timeout protection
- **Rate Limiting** - Built-in rate limiting support
- **API Key Validation** - Secure API key format checking
- **Character Limits** - 8-64 character password limits
- **Bulk Limits** - Maximum 1000 passwords per bulk request
- **Error Handling** - Secure error messages without data exposure

## 📊 Plan Limits

| Plan | Monthly Limit | Bulk Generation | Team Management |
|------|---------------|-----------------|-----------------|
| Basic | 10 passwords | ❌ | ❌ |
| Pro | 60 passwords | ✅ (60/month) | ✅ |
| Enterprise | Unlimited | ✅ (Unlimited) | ✅ |
| Annual | Unlimited | ✅ (Unlimited) | ✅ |

## 🛠️ Complete Examples

### Error Handling

Always handle errors properly:

```javascript
async function generatePasswordSafely() {
  try {
    const result = await sdk.generatePassword({ length: 16 });
    return result.password;
  } catch (error) {
    if (error.message.includes('401')) {
      console.error('❌ Authentication failed. Check your API key.');
    } else if (error.message.includes('429')) {
      console.error('❌ Rate limit exceeded. Please try again later.');
    } else if (error.message.includes('403')) {
      console.error('❌ Access denied. Check your plan and permissions.');
    } else {
      console.error('❌ Error:', error.message);
    }
    throw error;
  }
}
```

### React Component
```javascript
import React, { useState } from 'react';
import SecurePassSDK from 'securepass-pro-sdk';

function PasswordGenerator() {
  const [password, setPassword] = useState('');
  const sdk = new SecurePassSDK('your-api-key');

  const generatePassword = async () => {
    try {
      const result = await sdk.generatePassword({ length: 20 });
      setPassword(result.password);
    } catch (error) {
      console.error('Failed to generate password:', error);
    }
  };

  return (
    <div>
      <button onClick={generatePassword}>Generate Password</button>
      {password && <p>Generated: {password}</p>}
    </div>
  );
}
```

### Node.js Server
```javascript
const SecurePassSDK = require('securepass-pro-sdk');

const sdk = new SecurePassSDK('your-api-key');

async function generatePasswords() {
  try {
    // Generate single password
    const password = await sdk.generatePassword({ length: 32 });
    console.log('Password:', password.password);

    // Generate bulk passwords
    const bulkPasswords = await sdk.generateBulkPasswords(10, { length: 16 });
    console.log('Bulk passwords:', bulkPasswords.passwords);

    // Check usage
    const usage = await sdk.getUsage();
    console.log('Usage:', usage);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

generatePasswords();
```

### Team Management
```javascript
const sdk = new SecurePassSDK('your-api-key');

// Get team info
const teamInfo = await sdk.getTeamInfo('team_12345');
console.log('Team members:', teamInfo.team.members);

// Add new member
await sdk.addTeamMember('team_12345', 'newuser@company.com', 'member');

// Update role
await sdk.updateTeamMemberRole('team_12345', 'user@company.com', 'admin');
```

## 🚨 Important Notes

1. **API Key Security** - Never expose your API key in client-side code or public repositories
2. **API Key Format** - Must start with `spro_` and be at least 40 characters
3. **Plan Requirements** - SDK access requires Enterprise or Annual plan
4. **Rate Limits** - Respect the rate limits for your plan
5. **Error Handling** - Always handle errors gracefully
6. **Testing** - Use `testConnection()` to verify your setup before generating passwords
7. **Environment Variables** - Store API keys in environment variables:
   ```javascript
   const sdk = new SecurePassSDK(process.env.SECUREPASS_API_KEY);
   ```

## 📖 Documentation

- **[Getting Started Guide](./GETTING_STARTED.md)** - Complete step-by-step setup
- **[API Reference](#api-reference)** - Full API documentation
- **[Examples](#examples)** - Code examples for common use cases

## 🆘 Support

- **Documentation**: [https://securepasspro.co/docs](https://securepasspro.co/docs)
- **API Reference**: [https://securepasspro.co/api-docs](https://securepasspro.co/api-docs)
- **Support**: [support@securepasspro.co](mailto:support@securepasspro.co)
- **GitHub**: [https://github.com/securepasspro/securepass-sdk-js](https://github.com/securepasspro/securepass-sdk-js)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the SecurePass Pro Team**

The most secure password generator with cryptographically secure 256-bit encryption and zero-storage architecture. 