ALTER TABLE "appointments"
ADD COLUMN IF NOT EXISTS "appointment_price_in_cents" integer NOT NULL;