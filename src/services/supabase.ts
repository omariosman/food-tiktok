import { createClient } from '@supabase/supabase-js';
import { Database, UserType } from '../types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Helper functions for common operations
export const authHelpers = {
  signUp: async (email: string, password: string, metadata: { name: string }, userType: UserType = 'normal') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) return { data, error };

    // Create user profile with user type
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          name: metadata.name,
          email,
          user_type: userType,
        });

      if (profileError) {
        return { data, error: profileError };
      }
    }

    return { data, error };
  },
  
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },
  
  signOut: async () => {
    return await supabase.auth.signOut();
  },
  
  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email);
  },
};

// Database helper functions
export const dbHelpers = {
  // Users
  getUserProfile: async (userId: string) => {
    return await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
  },
  
  updateUserProfile: async (userId: string, updates: Database['public']['Tables']['users']['Update']) => {
    return await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
  },
  
  // Meals
  getMeals: async () => {
    return await supabase
      .from('meals')
      .select(`
        *,
        restaurant:users!restaurant_id(name, user_type)
      `)
      .order('created_at', { ascending: false });
  },
  
  createMeal: async (meal: Database['public']['Tables']['meals']['Insert']) => {
    return await supabase
      .from('meals')
      .insert(meal)
      .select()
      .single();
  },
  
  // Orders
  createOrder: async (order: Database['public']['Tables']['orders']['Insert']) => {
    return await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
  },
  
  getUserOrders: async (userId: string) => {
    return await supabase
      .from('orders')
      .select(`
        *,
        meal:meals(*),
        restaurant:users!restaurant_id(name)
      `)
      .eq('buyer_id', userId)
      .order('created_at', { ascending: false });
  },
  
  getRestaurantOrders: async (restaurantId: string) => {
    return await supabase
      .from('orders')
      .select(`
        *,
        meal:meals(*),
        buyer:users!buyer_id(name)
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
  },
};

// Storage helpers
export const storageHelpers = {
  uploadMealVideo: async (restaurantId: string, file: File, fileName: string) => {
    const filePath = `${restaurantId}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('meal-videos')
      .upload(filePath, file);
    
    if (error) return { data: null, error };
    
    const { data: urlData } = supabase.storage
      .from('meal-videos')
      .getPublicUrl(filePath);
    
    return { data: { ...data, publicUrl: urlData.publicUrl }, error: null };
  },
  
  deleteMealVideo: async (filePath: string) => {
    return await supabase.storage
      .from('meal-videos')
      .remove([filePath]);
  },
};