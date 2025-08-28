# Database Setup Guide

This guide covers the complete database setup for the Food TikTok application using Supabase.

## Database Schema

### Tables

#### Users Table
- **id**: UUID (Primary Key, Supabase Auth UID)
- **name**: Text (User full name)
- **email**: Text (Unique)
- **user_type**: Enum (normal, restaurant, influencer)
- **created_at**: Timestamp

#### Meals Table
- **id**: UUID (Primary Key)
- **restaurant_id**: UUID (Foreign Key → users.id)
- **name**: Text (Meal name)
- **description**: Text (Optional description)
- **video_url**: Text (Storage reference)
- **price**: Numeric (Must be > 0)
- **created_at**: Timestamp

#### Orders Table
- **id**: UUID (Primary Key)
- **meal_id**: UUID (Foreign Key → meals.id)
- **buyer_id**: UUID (Foreign Key → users.id)
- **restaurant_id**: UUID (Foreign Key → users.id)
- **address**: Text (Delivery address)
- **phone**: Text (Contact number)
- **status**: Enum (pending, confirmed, preparing, delivered, cancelled)
- **created_at**: Timestamp

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key
4. Update `.env` file with your credentials

### 2. Run Migrations
Execute the SQL files in order:
```sql
-- 1. Initial schema
\i supabase/migrations/20250828_001_initial_schema.sql

-- 2. RLS policies
\i supabase/migrations/20250828_002_rls_policies.sql

-- 3. Storage setup
\i supabase/migrations/20250828_003_storage_setup.sql
```

### 3. Configure Authentication
1. In Supabase Dashboard, go to Authentication > Settings
2. Enable email authentication
3. Configure OAuth providers (Google, Apple) if needed
4. Set redirect URLs for your app

### 4. Test Setup
Run the test suite to verify everything is working:
```typescript
import { runAllTests } from './src/tests/supabase.test';
runAllTests();
```

## Row Level Security (RLS) Policies

### Users Table
- Users can read their own data
- Users can update their own data
- Anyone can read restaurant/influencer profiles
- Users can insert their own profile

### Meals Table
- Anyone can read meals
- Only restaurants can create, update, delete their meals

### Orders Table
- Users can read their own orders as buyers
- Restaurants can read orders for their meals
- Users can create orders
- Restaurants can update orders for their meals

### Storage (Meal Videos)
- Anyone can view meal videos
- Only restaurants can upload videos
- Restaurants can only manage their own videos

## Storage Configuration

### Meal Videos Bucket
- **ID**: `meal-videos`
- **Public**: Yes
- **File Size Limit**: 50MB
- **Allowed Types**: MP4, QuickTime, AVI, WebM
- **Structure**: `/{restaurant-id}/{video-filename}`

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret
```

## Database Helpers

The app includes pre-built helper functions for common operations:

### Authentication
```typescript
import { authHelpers } from './src/services/supabase';

// Sign up
await authHelpers.signUp(email, password, { name });

// Sign in
await authHelpers.signIn(email, password);

// Sign out
await authHelpers.signOut();
```

### Database Operations
```typescript
import { dbHelpers } from './src/services/supabase';

// Get meals
const meals = await dbHelpers.getMeals();

// Create order
const order = await dbHelpers.createOrder(orderData);

// Get user orders
const orders = await dbHelpers.getUserOrders(userId);
```

### Storage Operations
```typescript
import { storageHelpers } from './src/services/supabase';

// Upload meal video
const result = await storageHelpers.uploadMealVideo(restaurantId, file, fileName);
```

## Troubleshooting

### Common Issues
1. **RLS Policy Errors**: Make sure user is authenticated and has correct permissions
2. **Storage Upload Fails**: Check file size and format restrictions
3. **Foreign Key Errors**: Ensure referenced records exist

### Testing Connection
Use the built-in test functions to verify your setup:
```typescript
import { testSupabaseConnection } from './src/tests/supabase.test';
const isConnected = await testSupabaseConnection();
```