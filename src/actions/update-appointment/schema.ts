import { z } from "zod";

export const updateAppointmentSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  date: z.string().min(1),
  time: z.string().optional(),
  appointmentPrice: z.number().min(0.01),
});

export type UpdateAppointmentSchema = z.infer<typeof updateAppointmentSchema>;
