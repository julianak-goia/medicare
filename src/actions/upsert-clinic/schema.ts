import { z } from "zod";

export const upsertClinicSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  type: z.string().optional(),
  phone: z.string().trim().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  zipCode: z.string().trim().optional(),
  address: z.string().trim().optional(),
  number: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
});

export type UpsertClinicSchema = z.infer<typeof upsertClinicSchema>;
