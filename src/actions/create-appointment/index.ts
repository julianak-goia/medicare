"use server";

import dayjs from "dayjs";
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

import { getAvailableTimes } from "../get-available-times";
import { createAppointmentSchema } from "./schema";

// function mergeDateAndTime(date: string, time?: string) {

//   const [year, month, day] = date.split("-").map(Number);

//   if (!time) {
//     return new Date(year, month - 1, day);
//   }

//   const [hours, minutes] = time.split(":").map(Number);
//   return new Date(year, month - 1, day, hours, minutes, 0, 0);
// }

export const createAppointment = actionClient
  .schema(createAppointmentSchema)
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

    const availableTimes = await getAvailableTimes({
      doctorId: parsedInput.doctorId,
      date: dayjs(parsedInput.date).format("YYYY-MM-DD"),
    });

    if (!availableTimes?.data) {
      throw new Error("Time not available");
    }
    const isTimeAvailable = availableTimes.data?.some(
      (time) => time.value === parsedInput.time && time.available,
    );

    if (!isTimeAvailable) {
      throw new Error("Time not available");
    }

    const [patient, doctorClinic] = await Promise.all([
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

    console.log("createAppointment.found", { patient, doctorClinic });

    if (!patient) {
      throw new Error("Patient not found");
    }

    if (!doctorClinic) {
      throw new Error("Doctor not found");
    }

    await db.insert(appointmentsTable).values({
      clinicId: parsedInput.clinicId,
      patientId: parsedInput.patientId,
      doctorId: parsedInput.doctorId,
      // date: mergeDateAndTime(parsedInput.date, parsedInput.time),
      date: `${parsedInput.date}T${parsedInput.time ?? "00:00:00"}`,
      appointmentPriceInCents: Math.round(parsedInput.appointmentPrice * 100),
    });

    revalidatePath("/appointments");
  });
