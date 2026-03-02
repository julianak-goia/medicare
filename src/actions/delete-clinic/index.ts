"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { db } from "@/db";
import { clinicsTable, usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

export const deleteClinic = actionClient
    .schema(
        z.object({
            id: z.string().uuid(),
        }),
    )
    .action(async ({ parsedInput }) => {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) {
            throw new Error("Unauthorized");
        }

        const userClinic = await db.query.usersToClinicsTable.findFirst({
            where: (table, { and }) =>
                and(
                    eq(table.clinicId, parsedInput.id),
                    eq(table.userId, session.user.id),
                ),
        });

        if (!userClinic) {
            throw new Error("Clínica não encontrada");
        }

        await db.delete(clinicsTable).where(eq(clinicsTable.id, parsedInput.id));
        revalidatePath("/clinics");
    });
