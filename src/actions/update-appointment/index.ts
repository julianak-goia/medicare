"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import { appointmentsTable, doctorsTable, patientsTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { updateAppointmentSchema } from "./schema";

function mergeDateAndTime(date: string, time?: string) {
  const appointmentDate = new Date(date);

  if (!time) {
    return appointmentDate;
  }

  const [hours, minutes] = time.split(":").map(Number);
  appointmentDate.setHours(hours, minutes, 0, 0);

  return appointmentDate;
}

export const updateAppointment = actionClient
  .schema(updateAppointmentSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    if (!session.user.clinic?.id) {
      throw new Error("Clinic not found");
    }

    const [appointment, patient, doctor] = await Promise.all([
      db.query.appointmentsTable.findFirst({
        where: eq(appointmentsTable.id, parsedInput.id),
      }),
      db.query.patientsTable.findFirst({
        where: and(
          eq(patientsTable.id, parsedInput.patientId),
          eq(patientsTable.clinicId, session.user.clinic.id),
        ),
      }),
      db.query.doctorsTable.findFirst({
        where: and(
          eq(doctorsTable.id, parsedInput.doctorId),
          eq(doctorsTable.clinicId, session.user.clinic.id),
        ),
      }),
    ]);

    if (!appointment || appointment.clinicId !== session.user.clinic.id) {
      throw new Error("Agendamento não encontrado");
    }

    if (!patient) {
      throw new Error("Patient not found");
    }

    if (!doctor) {
      throw new Error("Doctor not found");
    }

    await db
      .update(appointmentsTable)
      .set({
        patientId: parsedInput.patientId,
        doctorId: parsedInput.doctorId,
        date: mergeDateAndTime(parsedInput.date, parsedInput.time),
        appointmentPriceInCents: Math.round(parsedInput.appointmentPrice * 100),
      })
      .where(eq(appointmentsTable.id, parsedInput.id));

    revalidatePath("/appointments");
  });
