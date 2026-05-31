# Diagrama de Caso de Uso

```mermaid
flowchart LR
	admin["Usuário autenticado / Clinic Admin"]
	auth["Sistema de autenticação\n(Better Auth)"]

	login((Autenticar-se))
	manageClinics((Gerenciar clinics))
	manageDoctors((Gerenciar doctors))
	managePatients((Gerenciar patients))
	manageAppointments((Gerenciar appointments))
	checkTimes((Consultar horários disponíveis))
	validateClinic((Validar acesso à clínica))

	admin --> login
	admin --> manageClinics
	admin --> manageDoctors
	admin --> managePatients
	admin --> manageAppointments

	manageAppointments --> checkTimes
	manageAppointments --> validateClinic
	manageDoctors --> validateClinic
	managePatients --> validateClinic
	manageClinics --> validateClinic

	auth --> login
```

## Observações

- O sistema atual é centrado no usuário autenticado da clínica; não há login separado para doctor ou patient.
- A validação de acesso à clínica aparece nos fluxos de gestão e agendamento.
