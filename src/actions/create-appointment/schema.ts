import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid({ message: "Paciente é obrigatório." }),
  doctorId: z.string().uuid({ message: "Médico é obrigatório." }),
  date: z.string().min(1, { message: "Data é obrigatória." }),
  time: z.string().optional(),
  appointmentPrice: z.number().min(0.01, {
    message: "Valor da consulta é obrigatório.",
  }),
});

export type CreateAppointmentSchema = z.infer<typeof createAppointmentSchema>;
