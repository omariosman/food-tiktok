import { authHelpers } from '../services/supabase';

describe('Authentication', () => {
  it('should have auth helpers available', () => {
    expect(authHelpers).toBeDefined();
    expect(authHelpers.signUp).toBeDefined();
    expect(authHelpers.signIn).toBeDefined();
    expect(authHelpers.signOut).toBeDefined();
    expect(authHelpers.resetPassword).toBeDefined();
    expect(authHelpers.getCurrentUser).toBeDefined();
  });

  it('should handle user type correctly', async () => {
    // Test that signup function accepts userType parameter
    const signUpFunction = authHelpers.signUp;
    expect(signUpFunction.length).toBe(4); // email, password, metadata, userType
  });
});