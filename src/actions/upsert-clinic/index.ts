"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { upsertClinicSchema } from "./schema";

export const upsertClinic = actionClient
    .schema(upsertClinicSchema)
    .action(async ({ parsedInput }) => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        if (parsedInput.id) {
            // Update: verify ownership first
            const userClinic = await db.query.usersToClinicsTable.findFirst({
                where: (table, { and }) =>
                    and(
                        eq(table.clinicId, parsedInput.id!),
                        eq(table.userId, session.user.id),
                    ),
            });

            if (!userClinic) {
                throw new Error("Clínica não encontrada");
            }

            await db
                .update(clinicsTable)
                .set({ name: parsedInput.name })
                .where(eq(clinicsTable.id, parsedInput.id));
        } else {
            // Create
            const [clinic] = await db
                .insert(clinicsTable)
                .values({ name: parsedInput.name })
                .returning();

            await db.insert(usersToClinicsTable).values({
                userId: session.user.id,
                clinicId: clinic.id,
            });
        }

        revalidatePath("/clinics");
    });
