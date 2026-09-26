/*
# Create profiles and vendors tables for JaipurRoute

1. New Tables
- `profiles` — extends auth.users with display name and avatar URL
  - `id` (uuid, PK, references auth.users)
  - `full_name` (text)
  - `avatar_url` (text, nullable)
  - `created_at` (timestamptz)
- `vendors` — local vendors listed on the platform
  - `id` (uuid, PK)
  - `name` (text, not null)
  - `category` (text, not null) — one of: food, stays, guides, gems
  - `description` (text)
  - `image_url` (text)
  - `rating` (numeric, default 4.5)
  - `price_range` (text, e.g. "₹100–300")
  - `location` (text)
  - `kyc_verified` (boolean, default true)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on both tables.
- profiles: owner-scoped CRUD (authenticated users manage their own profile).
- vendors: public read for anon+authenticated (vendor directory is shared), no writes from the client.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text DEFAULT '',
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('food', 'stays', 'guides', 'gems')),
  description text DEFAULT '',
  image_url text DEFAULT '',
  rating numeric(2,1) DEFAULT 4.5,
  price_range text DEFAULT '',
  location text DEFAULT '',
  kyc_verified boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_vendors" ON vendors;
CREATE POLICY "anon_read_vendors" ON vendors FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(category);
