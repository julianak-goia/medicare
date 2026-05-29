"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/db";
import {
  appointmentsTable,
  doctorsToClinicsTable,
  patientsTable,
  usersToClinicsTable,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { actionClient } from "@/lib/next-safe-action";

import { updateAppointmentSchema } from "./schema";

function mergeDateAndTime(date: string, time?: string) {
  // Expect `date` in YYYY-MM-DD format (no timezone). Build a local Date
  // using the provided date parts and the provided time parts so we don't
  // accidentally shift the time due to ISO timezone conversions.
  const [year, month, day] = date.split("-").map(Number);

  if (!time) {
    return new Date(year, month - 1, day);
  }

  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes, 0, 0);
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

    const clinicAccess = await db.query.usersToClinicsTable.findFirst({
      where: and(
        eq(usersToClinicsTable.userId, session.user.id),
        eq(usersToClinicsTable.clinicId, parsedInput.clinicId),
      ),
    });

    if (!clinicAccess) {
      throw new Error("Clinic not found");
    }

    const [appointment, patient, doctorClinic] = await Promise.all([
      db.query.appointmentsTable.findFirst({
        where: eq(appointmentsTable.id, parsedInput.id),
      }),
      db.query.patientsTable.findFirst({
        where: eq(patientsTable.id, parsedInput.patientId),
      }),
      db.query.doctorsToClinicsTable.findFirst({
        where: and(
          eq(doctorsToClinicsTable.doctorId, parsedInput.doctorId),
          eq(doctorsToClinicsTable.clinicId, parsedInput.clinicId),
        ),
      }),
    ]);

    if (!appointment) {
      throw new Error("Agendamento não encontrado");
    }

    const appointmentAccess = await db.query.usersToClinicsTable.findFirst({
      where: and(
        eq(usersToClinicsTable.userId, session.user.id),
        eq(usersToClinicsTable.clinicId, appointment.clinicId),
      ),
    });

    if (!appointmentAccess) {
      throw new Error("Clinic not found");
    }

    if (!patient) {
      throw new Error("Patient not found");
    }

    if (!doctorClinic) {
      throw new Error("Doctor not found");
    }

    await db
      .update(appointmentsTable)
      .set({
        clinicId: parsedInput.clinicId,
        patientId: parsedInput.patientId,
        doctorId: parsedInput.doctorId,
        date: mergeDateAndTime(parsedInput.date, parsedInput.time),
        appointmentPriceInCents: Math.round(parsedInput.appointmentPrice * 100),
      })
      .where(eq(appointmentsTable.id, parsedInput.id));

    revalidatePath("/appointments");
  });
