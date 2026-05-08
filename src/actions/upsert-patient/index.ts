"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertPatientSchema } from "./schema";

// Helper function to process patient data before database operation
function processPatientData(input: z.infer<typeof upsertPatientSchema>) {
  return {
    id: input.id,
    name: input.name,
    email: input.email,
    phoneNumber: input.phoneNumber,
    sex: input.sex,
    cpf: input.cpf && input.cpf.trim() ? input.cpf : null,
    birthDate: input.birthDate ? new Date(input.birthDate) : null,
    zipCode: input.zipCode && input.zipCode.trim() ? input.zipCode : null,
    address: input.address && input.address.trim() ? input.address : null,
    number: input.number && input.number.trim() ? input.number : null,
    city: input.city && input.city.trim() ? input.city : null,
    state: input.state && input.state.trim() ? input.state : null,
    bloodType:
      input.bloodType && input.bloodType.trim() ? input.bloodType : null,
    insurance:
      input.insurance && input.insurance.trim() ? input.insurance : null,
  };
}

export const upsertPatient = actionClient
  .schema(upsertPatientSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }
    if (!session?.user.clinic?.id) {
      throw new Error("Clinic not found");
    }

    const processedData = processPatientData(parsedInput);

    await db
      .insert(patientsTable)
      .values({
        ...processedData,
        clinicId: session.user.clinic.id,
      })
      .onConflictDoUpdate({
        target: [patientsTable.id],
        set: processedData,
      });

    revalidatePath("/patients");
  });
