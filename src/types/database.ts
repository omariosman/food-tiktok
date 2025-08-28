export type UserType = 'normal' | 'restaurant' | 'influencer';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          user_type: UserType;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          user_type?: UserType;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          user_type?: UserType;
          created_at?: string;
        };
        Relationships: [];
      };
      meals: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          description: string | null;
          video_url: string | null;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          description?: string | null;
          video_url?: string | null;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          description?: string | null;
          video_url?: string | null;
          price?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "meals_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          meal_id: string;
          buyer_id: string;
          restaurant_id: string;
          address: string;
          phone: string;
          status: OrderStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          meal_id: string;
          buyer_id: string;
          restaurant_id: string;
          address: string;
          phone: string;
          status?: OrderStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          meal_id?: string;
          buyer_id?: string;
          restaurant_id?: string;
          address?: string;
          phone?: string;
          status?: OrderStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_meal_id_fkey";
            columns: ["meal_id"];
            isOneToOne: false;
            referencedRelation: "meals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_buyer_id_fkey";
            columns: ["buyer_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "orders_restaurant_id_fkey";
            columns: ["restaurant_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_type: UserType;
      order_status: OrderStatus;
    };
  };
}