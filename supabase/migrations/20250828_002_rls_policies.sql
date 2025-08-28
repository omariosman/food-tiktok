-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read their own data" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can read restaurant profiles" ON users
    FOR SELECT USING (user_type = 'restaurant' OR user_type = 'influencer');

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Meals table policies
CREATE POLICY "Anyone can read meals" ON meals
    FOR SELECT USING (true);

CREATE POLICY "Restaurants can insert their own meals" ON meals
    FOR INSERT WITH CHECK (
        auth.uid() = restaurant_id AND 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'restaurant')
    );

CREATE POLICY "Restaurants can update their own meals" ON meals
    FOR UPDATE USING (
        auth.uid() = restaurant_id AND 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'restaurant')
    );

CREATE POLICY "Restaurants can delete their own meals" ON meals
    FOR DELETE USING (
        auth.uid() = restaurant_id AND 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'restaurant')
    );

-- Orders table policies
CREATE POLICY "Users can read their own orders as buyers" ON orders
    FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Restaurants can read orders for their meals" ON orders
    FOR SELECT USING (auth.uid() = restaurant_id);

CREATE POLICY "Users can create orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Restaurants can update orders for their meals" ON orders
    FOR UPDATE USING (
        auth.uid() = restaurant_id AND 
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND user_type = 'restaurant')
    );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, name, email)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();