import { createClient } from '@supabase/supabase-js';
import { Database, UserType } from '../types/database';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'mock-anon-key';

// For development: use mock data when Supabase is not configured
const isMockMode = supabaseUrl === 'https://mock.supabase.co';

export const supabase = isMockMode 
  ? null 
  : createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });

// Mock data for development
const mockUser = {
  id: 'mock-user-id',
  email: 'test@example.com',
  name: 'Test User',
  user_type: 'normal' as UserType,
};

// Helper functions for common operations
export const authHelpers = {
  signUp: async (email: string, password: string, metadata: { name: string }, userType: UserType = 'normal') => {
    if (isMockMode) {
      return {
        data: { user: { ...mockUser, email, ...metadata } },
        error: null
      };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
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
    if (isMockMode) {
      return {
        data: { user: { ...mockUser, email } },
        error: null
      };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },
  
  signOut: async () => {
    if (isMockMode) {
      return { error: null };
    }
    
    if (!supabase) return { error: { message: 'Supabase not initialized' } };
    
    return await supabase.auth.signOut();
  },
  
  getCurrentUser: () => {
    if (isMockMode) {
      return Promise.resolve({ data: { user: mockUser }, error: null });
    }
    
    if (!supabase) return Promise.resolve({ data: { user: null }, error: { message: 'Supabase not initialized' } });
    
    return supabase.auth.getUser();
  },

  resetPassword: async (email: string) => {
    if (isMockMode) {
      return { data: null, error: null };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
    return await supabase.auth.resetPasswordForEmail(email);
  },
};

// Mock data for development
const mockMeals = [
  {
    id: '1',
    title: 'Delicious Pasta',
    description: 'Fresh homemade pasta with tomato sauce',
    price: 12.99,
    video_url: 'https://example.com/video1.mp4',
    restaurant_id: 'restaurant-1',
    created_at: new Date().toISOString(),
    restaurant: { name: 'Italian Kitchen', user_type: 'restaurant' }
  },
  {
    id: '2',
    title: 'Grilled Chicken',
    description: 'Juicy grilled chicken with herbs',
    price: 15.99,
    video_url: 'https://example.com/video2.mp4',
    restaurant_id: 'restaurant-2',
    created_at: new Date().toISOString(),
    restaurant: { name: 'Grill House', user_type: 'restaurant' }
  }
];

const mockOrders = [
  {
    id: '1',
    buyer_id: 'mock-user-id',
    restaurant_id: 'restaurant-1',
    meal_id: '1',
    quantity: 2,
    total_price: 25.98,
    status: 'pending' as const,
    created_at: new Date().toISOString(),
    meal: mockMeals[0],
    restaurant: { name: 'Italian Kitchen' }
  }
];

// Database helper functions
export const dbHelpers = {
  // Users
  getUserProfile: async (userId: string) => {
    if (isMockMode) {
      return { data: mockUser, error: null };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
    return await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
  },
  
  updateUserProfile: async (userId: string, updates: Database['public']['Tables']['users']['Update']) => {
    if (isMockMode) {
      return { data: { ...mockUser, ...updates }, error: null };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
    return await supabase
      .from('users')
      .update(updates)
      .eq('id', userId);
  },
  
  // Meals
  getMeals: async () => {
    if (isMockMode) {
      return { data: mockMeals, error: null };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
    return await supabase
      .from('meals')
      .select(`
        *,
        restaurant:users!restaurant_id(name, user_type)
      `)
      .order('created_at', { ascending: false });
  },
  
  createMeal: async (meal: Database['public']['Tables']['meals']['Insert']) => {
    if (isMockMode) {
      const newMeal = {
        id: Math.random().toString(),
        ...meal,
        created_at: new Date().toISOString(),
        restaurant: { name: 'Mock Restaurant', user_type: 'restaurant' }
      };
      return { data: newMeal, error: null };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
    return await supabase
      .from('meals')
      .insert(meal)
      .select()
      .single();
  },
  
  // Orders
  createOrder: async (order: Database['public']['Tables']['orders']['Insert']) => {
    if (isMockMode) {
      const newOrder = {
        id: Math.random().toString(),
        ...order,
        created_at: new Date().toISOString(),
        status: 'pending' as const
      };
      return { data: newOrder, error: null };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
    return await supabase
      .from('orders')
      .insert(order)
      .select()
      .single();
  },
  
  getUserOrders: async (userId: string) => {
    if (isMockMode) {
      return { data: mockOrders, error: null };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
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
    if (isMockMode) {
      return { data: mockOrders.filter(order => order.restaurant_id === restaurantId), error: null };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
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
    if (isMockMode) {
      return {
        data: {
          path: `${restaurantId}/${fileName}`,
          publicUrl: `https://mock-storage.com/${restaurantId}/${fileName}`
        },
        error: null
      };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
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
    if (isMockMode) {
      return { data: null, error: null };
    }
    
    if (!supabase) return { data: null, error: { message: 'Supabase not initialized' } };
    
    return await supabase.storage
      .from('meal-videos')
      .remove([filePath]);
  },
};