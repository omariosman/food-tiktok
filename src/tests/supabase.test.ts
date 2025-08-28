import { supabase, authHelpers, dbHelpers, storageHelpers } from '../services/supabase';
import { UserType } from '../types/database';

export const testSupabaseConnection = async () => {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase.from('users').select('count').limit(0);
    if (error) {
      console.error('❌ Connection failed:', error.message);
      return false;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    return false;
  }
};

export const testUserOperations = async () => {
  console.log('🧪 Testing user operations...');
  
  try {
    // Test getting current user (should work even if no user is logged in)
    const { data: user, error } = await authHelpers.getCurrentUser();
    console.log('✅ Get current user:', user?.user ? 'User found' : 'No user logged in');
    
    // Test getting meals (public access)
    const { data: meals, error: mealsError } = await dbHelpers.getMeals();
    if (mealsError) {
      console.error('❌ Get meals failed:', mealsError.message);
      return false;
    }
    console.log(`✅ Get meals successful: ${meals?.length || 0} meals found`);
    
    return true;
  } catch (error) {
    console.error('❌ User operations test failed:', error);
    return false;
  }
};

export const testRLSPolicies = async () => {
  console.log('🧪 Testing RLS policies...');
  
  try {
    // Test that unauthenticated users can read meals but not create them
    const { data: meals, error: mealsError } = await supabase
      .from('meals')
      .select('*')
      .limit(5);
    
    if (mealsError) {
      console.error('❌ Read meals test failed:', mealsError.message);
      return false;
    }
    console.log('✅ Unauthenticated users can read meals');
    
    // Test that unauthenticated users cannot create meals
    const { data: createTest, error: createError } = await supabase
      .from('meals')
      .insert({
        restaurant_id: 'test-id',
        name: 'Test Meal',
        price: 10.00
      });
    
    if (!createError) {
      console.error('❌ RLS policy failed - unauthenticated user could create meal');
      return false;
    }
    console.log('✅ RLS policy working - unauthenticated users cannot create meals');
    
    return true;
  } catch (error) {
    console.error('❌ RLS policies test failed:', error);
    return false;
  }
};

export const testStorageConfiguration = async () => {
  console.log('🧪 Testing storage configuration...');
  
  try {
    // Test that storage bucket exists and is accessible
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Storage test failed:', error.message);
      return false;
    }
    
    const mealVideosBucket = buckets?.find(bucket => bucket.id === 'meal-videos');
    if (!mealVideosBucket) {
      console.error('❌ Meal videos bucket not found');
      return false;
    }
    
    console.log('✅ Meal videos storage bucket configured correctly');
    return true;
  } catch (error) {
    console.error('❌ Storage configuration test failed:', error);
    return false;
  }
};

export const runAllTests = async () => {
  console.log('🚀 Starting Supabase integration tests...\n');
  
  const tests = [
    { name: 'Connection', test: testSupabaseConnection },
    { name: 'User Operations', test: testUserOperations },
    { name: 'RLS Policies', test: testRLSPolicies },
    { name: 'Storage Configuration', test: testStorageConfiguration }
  ];
  
  let passedTests = 0;
  
  for (const { name, test } of tests) {
    console.log(`\n--- ${name} Test ---`);
    const passed = await test();
    if (passed) {
      passedTests++;
    }
    console.log(`${passed ? '✅' : '❌'} ${name} test ${passed ? 'passed' : 'failed'}`);
  }
  
  console.log(`\n🏁 Tests completed: ${passedTests}/${tests.length} passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 All tests passed! Supabase integration is working correctly.');
  } else {
    console.log('⚠️ Some tests failed. Please check your Supabase configuration.');
  }
  
  return passedTests === tests.length;
};