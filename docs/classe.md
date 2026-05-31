# Diagrama de Classe

```mermaid
classDiagram
	class User {
		+string id
		+string name
		+string email
		+boolean emailVerified
		+string image
		+timestamp createdAt
		+timestamp updatedAt
	}

	class Session {
		+string id
		+timestamp expiresAt
		+string token
		+timestamp createdAt
		+timestamp updatedAt
		+string ipAddress
		+string userAgent
		+string userId
	}

	class Account {
		+string id
		+string accountId
		+string providerId
		+string userId
		+string accessToken
		+string refreshToken
		+string idToken
		+timestamp createdAt
		+timestamp updatedAt
	}

	class Verification {
		+string id
		+string identifier
		+string value
		+timestamp expiresAt
		+timestamp createdAt
		+timestamp updatedAt
	}

	class Clinic {
		+uuid id
		+string name
		+string type
		+string nature
		+string[] services
		+string[] acceptedInsurancePlans
		+string phone
		+string email
		+string zipCode
		+string address
		+string number
		+string city
		+string state
		+timestamp createdAt
		+timestamp updatedAt
	}

	class UsersToClinics {
		+string userId
		+uuid clinicId
		+timestamp createdAt
		+timestamp updatedAt
	}

	class Doctor {
		+uuid id
		+uuid clinicId
		+string name
		+string avatarImageUrl
		+int availableFromWeekDay
		+int availableToWeekDay
		+time availableFromTime
		+time availableToTime
		+string specialty
		+int appointmentPriceInCents
		+timestamp createdAt
		+timestamp updatedAt
	}

	class DoctorsToClinics {
		+uuid doctorId
		+uuid clinicId
	}

	class Patient {
		+uuid id
		+uuid clinicId
		+string name
		+string email
		+string cpf
		+timestamp birthDate
		+string phoneNumber
		+string zipCode
		+string address
		+string number
		+string city
		+string state
		+string bloodType
		+string insurance
		+patient_sex sex
		+timestamp createdAt
		+timestamp updatedAt
	}

	class Appointment {
		+uuid id
		+timestamp date
		+int appointmentPriceInCents
		+uuid clinicId
		+uuid patientId
		+uuid doctorId
		+timestamp createdAt
		+timestamp updatedAt
	}

	User "1" --> "0..*" Session
	User "1" --> "0..*" Account
	User "1" --> "0..*" UsersToClinics
	Clinic "1" --> "0..*" UsersToClinics

	Clinic "1" --> "0..*" Doctor
	Clinic "1" --> "0..*" Patient
	Clinic "1" --> "0..*" Appointment

	Doctor "1" --> "0..*" Appointment
	Patient "1" --> "0..*" Appointment

	Doctor "1" --> "0..*" DoctorsToClinics
	Clinic "1" --> "0..*" DoctorsToClinics

	note for Doctor "O schema atual mantém clinicId em Doctor\ne também sincroniza doctors_to_clinics no upsertDoctor."
	note for User "A clínica ativa é derivada na sessão customizada\nvia users_to_clinics, não no registro de User."
```

## Observações

- O schema atual combina autenticacao, vinculo de usuarios a clinicas e o dominio operacional da clinica.
- O vínculo de doctor com clinic aparece em dois pontos do código: `clinicId` direto em `Doctor` e a tabela de junção `doctors_to_clinics`.
- A clínica ativa do usuário é resolvida em tempo de sessão em [src/lib/auth.ts](../src/lib/auth.ts), com base em [src/db/schema.ts](../src/db/schema.ts).
