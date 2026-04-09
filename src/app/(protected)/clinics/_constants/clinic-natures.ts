export enum ClinicNature {
  PUBLICO = "Público",
  PRIVADO = "Privado",
}

export const clinicNatures = Object.entries(ClinicNature).map(
  ([key, value]) => ({
    value: ClinicNature[key as keyof typeof ClinicNature],
    label: value,
  }),
);
