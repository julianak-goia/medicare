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
    id: input.id ?? undefined,
    name: input.name,
    email: input.email,
    phoneNumber: input.phoneNumber,
    sex: input.sex,
    cpf: input.cpf,
    birthDate: new Date(input.birthDate),
    zipCode: input.zipCode,
    address: input.address,
    number: input.number,
    city: input.city,
    state: input.state,
    bloodType: input.bloodType,
    insurance: input.insurance,
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
    // Temporary debug log to verify incoming payload
    // Remove or comment out in production
    console.log("upsertPatient parsedInput:", parsedInput);
    // If an id is provided, perform an update to avoid creating a new record.
    if (processedData.id) {
      const updateData = { ...processedData } as Record<string, any>;
      delete updateData.id;
      await db
        .update(patientsTable)
        .set({
          ...updateData,
          clinicId: session.user.clinic.id,
        })
        .where(eq(patientsTable.id, processedData.id));
    } else {
      await db.insert(patientsTable).values({
        ...processedData,
        clinicId: session.user.clinic.id,
      });
    }

    revalidatePath("/patients");
  });
