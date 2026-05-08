import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, { message: "Nome é obrigatório." }),
  email: z.string().email({ message: "Email inválido." }),
  phoneNumber: z.string().trim().min(1, { message: "Telefone é obrigatório." }),
  sex: z.enum(["male", "female"]),
  cpf: z.string().optional(),
  birthDate: z.string().optional(), // ISO format string from <input type="date" />
  zipCode: z.string().optional(),
  address: z.string().optional(),
  number: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  bloodType: z.string().optional(),
  insurance: z.string().optional(),
});

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>;
