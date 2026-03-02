CREATE TABLE "doctors_to_clinics" (
"doctor_id" uuid NOT NULL,
"clinic_id" uuid NOT NULL,
CONSTRAINT "doctors_to_clinics_doctor_id_clinic_id_pk" PRIMARY KEY("doctor_id","clinic_id")
);
--> statement-breakpoint
ALTER TABLE "doctors_to_clinics" ADD CONSTRAINT "doctors_to_clinics_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "doctors_to_clinics" ADD CONSTRAINT "doctors_to_clinics_clinic_id_clinics_id_fk" FOREIGN KEY ("clinic_id") REFERENCES "public"."clinics"("id") ON DELETE cascade ON UPDATE no action;
