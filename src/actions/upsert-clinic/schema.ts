import { z } from "zod";

export const upsertClinicSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, {
    message: "Nome é obrigatório.",
  }),
  type: z.string().optional(),
  nature: z.enum(["Público", "Privado"], {
    error: "Natureza é obrigatória.",
  }),
  services: z
    .array(z.string().trim().min(1))
    .min(1, { message: "Selecione ao menos um serviço." }),
  acceptedInsurancePlans: z
    .array(z.string().trim().min(1))
    .min(1, { message: "Selecione ao menos um convênio." }),
  phone: z.string().trim().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  zipCode: z.string().trim().optional(),
  address: z.string().trim().optional(),
  number: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().optional(),
});

export type UpsertClinicSchema = z.infer<typeof upsertClinicSchema>;
