/*
# Update vendors table for GhumBey (Lucknow)

1. Modified Tables
- `vendors`: Add `whatsapp_number` column (text) for WhatsApp booking flow.
  - Replace category CHECK constraint with new categories: stays, autos, foodwalks, heritage.
  - Truncate existing Jaipur vendor data (will reseed with Lucknow vendors).

2. Security
- No RLS policy changes. Existing anon read policy remains.
*/

ALTER TABLE vendors ADD COLUMN IF NOT EXISTS whatsapp_number text DEFAULT '';

-- Clear old Jaipur vendor data
TRUNCATE vendors;

-- Replace the category check constraint
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS vendors_category_check;
ALTER TABLE vendors ADD CONSTRAINT vendors_category_check CHECK (category IN ('stays', 'autos', 'foodwalks', 'heritage'));
