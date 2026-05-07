import { z } from "zod";

export const deletePatientSchema = z.object({
  id: z.string().uuid(),
});

export type DeletePatientSchema = z.infer<typeof deletePatientSchema>;
