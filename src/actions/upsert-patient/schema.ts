import { z } from "zod";

export const upsertPatientSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1, { message: "Nome é obrigatório." }),
  email: z.string().email({ message: "Email inválido." }),
  phoneNumber: z.string().trim().min(1, { message: "Telefone é obrigatório." }),
  sex: z.enum(["male", "female"], { message: "Sexo é obrigatório." }),
  cpf: z.string().trim().min(1, { message: "CPF é obrigatório." }),
  birthDate: z
    .string()
    .trim()
    .min(1, { message: "Data de nascimento é obrigatória." }),
  zipCode: z.string().trim().min(1, { message: "CEP é obrigatório." }),
  address: z.string().trim().min(1, { message: "Endereço é obrigatório." }),
  number: z.string().trim().min(1, { message: "Número é obrigatório." }),
  city: z.string().trim().min(1, { message: "Cidade é obrigatória." }),
  state: z.string().trim().min(1, { message: "Estado é obrigatório." }),
  bloodType: z.string().min(1, { message: "Tipo sanguíneo é obrigatório." }),
  insurance: z.string().min(1, { message: "Convênio é obrigatório." }),
});

export type UpsertPatientSchema = z.infer<typeof upsertPatientSchema>;
