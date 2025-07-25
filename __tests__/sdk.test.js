import SecurePassSDK from '../src/securepass-sdk.js';

describe('SecurePassSDK', () => {
  let sdk;

  beforeEach(() => {
    sdk = new SecurePassSDK('test-api-key-12345', {
      baseURL: 'http://localhost:3000/api'
    });
  });

  test('should initialize with API key', () => {
    expect(sdk.apiKey).toBe('test-api-key-12345');
    expect(sdk.baseURL).toBe('http://localhost:3000/api');
  });

  test('should throw error for invalid API key', () => {
    expect(() => new SecurePassSDK('')).toThrow('Invalid API key provided');
    expect(() => new SecurePassSDK('short')).toThrow('Invalid API key provided');
  });

  test('should have all required methods', () => {
    expect(typeof sdk.generatePassword).toBe('function');
    expect(typeof sdk.generateBulkPasswords).toBe('function');
    expect(typeof sdk.getUsage).toBe('function');
    expect(typeof sdk.testConnection).toBe('function');
    expect(typeof sdk.getTeamInfo).toBe('function');
    expect(typeof sdk.addTeamMember).toBe('function');
    expect(typeof sdk.removeTeamMember).toBe('function');
    expect(typeof sdk.updateTeamMemberRole).toBe('function');
  });
}); 