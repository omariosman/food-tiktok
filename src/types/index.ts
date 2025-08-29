// Global type definitions
import { UserType, OrderStatus } from './database';

// Re-export types from database for convenience
export { UserType, OrderStatus };

export interface User {
  id: string;
  name: string;
  email: string;
  user_type: UserType;
  created_at: string;
}

export interface Meal {
  id: string;
  restaurant_id: string;
  name: string;
  description?: string | null;
  video_url?: string | null;
  price: number;
  created_at: string;
  restaurant?: Pick<User, 'name' | 'user_type'>;
}

export interface Order {
  id: string;
  meal_id: string;
  buyer_id: string;
  restaurant_id: string;
  address: string;
  phone: string;
  status: OrderStatus;
  created_at: string;
  meal?: Meal;
  buyer?: Pick<User, 'name'>;
  restaurant?: Pick<User, 'name'>;
}