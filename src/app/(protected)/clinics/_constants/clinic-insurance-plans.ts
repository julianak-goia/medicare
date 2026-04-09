export enum ClinicInsurancePlan {
  UNIMED = "Unimed",
  AMIL = "Amil",
  BRADESCO_SAUDE = "Bradesco Saúde",
  SULAMERICA = "SulAmérica",
  NOTREDAME_INTERMEDICA = "NotreDame Intermédica",
  HAPVIDA = "Hapvida",
  PORTO_SAUDE = "Porto Saúde",
  GOLDEN_CROSS = "Golden Cross",
  OMINT = "Omint",
  CASSI = "CASSI",
  GEAP = "GEAP Saúde",
  CABERJ = "Caberj",
}

export const clinicInsurancePlans = Object.entries(ClinicInsurancePlan).map(
  ([key, value]) => ({
    value: ClinicInsurancePlan[key as keyof typeof ClinicInsurancePlan],
    label: value,
  }),
);
