-- Create category_descriptions table
CREATE TABLE IF NOT EXISTS category_descriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, subcategory)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_category_descriptions_category ON category_descriptions(category);
CREATE INDEX IF NOT EXISTS idx_category_descriptions_subcategory ON category_descriptions(subcategory);

-- Enable RLS
ALTER TABLE category_descriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read descriptions (public)
CREATE POLICY "Anyone can read category descriptions"
  ON category_descriptions
  FOR SELECT
  USING (true);

-- Policy: Only authenticated admins can insert/update
CREATE POLICY "Admins can insert category descriptions"
  ON category_descriptions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.raw_user_meta_data->>'role' = 'Admin')
    )
  );

CREATE POLICY "Admins can update category descriptions"
  ON category_descriptions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.raw_user_meta_data->>'role' = 'Admin')
    )
  );

CREATE POLICY "Admins can delete category descriptions"
  ON category_descriptions
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND (auth.users.raw_user_meta_data->>'role' = 'admin' OR auth.users.raw_user_meta_data->>'role' = 'Admin')
    )
  );

