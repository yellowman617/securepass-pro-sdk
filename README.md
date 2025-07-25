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

```bash
npm install securepass-pro-sdk
```

## 🎯 Quick Start

```javascript
import SecurePassSDK from 'securepass-pro-sdk';

// Initialize with your API key
const sdk = new SecurePassSDK('your-api-key-here');

// Generate a secure password
const password = await sdk.generatePassword({ length: 16 });
console.log(password.password); // Your generated password
```

## 📋 API Reference

### Constructor

```javascript
const sdk = new SecurePassSDK(apiKey, options);
```

**Parameters:**
- `apiKey` (string): Your SecurePass Pro API key
- `options` (object, optional):
  - `baseURL` (string): Custom API URL (default: `https://securepasspro.com/api`)
  - `timeout` (number): Request timeout in ms (default: `10000`)

### Methods

#### `generatePassword(options)`
Generate a single secure password.

```javascript
const password = await sdk.generatePassword({
  length: 16, // 8-64 characters
});
```

#### `generateBulkPasswords(count, options)`
Generate multiple passwords (up to 1000).

```javascript
const bulkPasswords = await sdk.generateBulkPasswords(10, {
  length: 16
});
console.log(bulkPasswords.passwords); // Array of passwords
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

```javascript
const usage = await sdk.getUsage();
console.log(usage.plan); // Your current plan
console.log(usage.usedGenerations); // Passwords used this month
```

#### `testConnection()`
Test API connection and authentication.

```javascript
const test = await sdk.testConnection();
console.log(test.success); // true/false
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
| Pro | 20 passwords | ✅ (20/month) | ✅ |
| Enterprise | Unlimited | ✅ (Unlimited) | ✅ |
| Annual | Unlimited | ✅ (Unlimited) | ✅ |

## 🛠️ Examples

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

1. **API Key Security** - Never expose your API key in client-side code
2. **Rate Limits** - Respect the rate limits for your plan
3. **Error Handling** - Always handle errors gracefully
4. **Testing** - Use `testConnection()` to verify your setup

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