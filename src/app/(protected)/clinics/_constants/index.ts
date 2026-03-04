export enum ClinicType {
  CLINICA_GERAL = "Clínica Geral",
  UBS = "UBS - Unidade Básica de Saúde",
  UPA = "UPA - Unidade de Pronto Atendimento",
  LABORATORIO = "Laboratório",
  HOSPITAL = "Hospital",
  CLINICA_ESPECIALIZADA = "Clínica Especializada",
  CONSULTORIO = "Consultório",
  CENTRO_CIRURGICO = "Centro Cirúrgico",
  DIAGNOSTICO = "Centro de Diagnóstico",
}

export const clinicTypes = Object.entries(ClinicType).map(([key, value]) => ({
  value: ClinicType[key as keyof typeof ClinicType],
  label: value,
}));
