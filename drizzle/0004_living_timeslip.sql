ALTER TABLE "clinics" ALTER COLUMN "zip_code" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "address" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "number" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "city" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ALTER COLUMN "state" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "appointment_price_in_cents" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "nature" text;--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "services" text[];--> statement-breakpoint
ALTER TABLE "clinics" ADD COLUMN "accepted_insurance_plans" text[];--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "cpf" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "birth_date" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "zip_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "address" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "number" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "city" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "state" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "blood_type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "patients" ADD COLUMN "insurance" text NOT NULL;