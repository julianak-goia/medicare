# 🏥 Medicare – Hospital Management System

Sistema web para gerenciamento hospitalar desenvolvido como projeto acadêmico do curso de **Análise e Desenvolvimento de Sistemas**, utilizando arquitetura em **três camadas**: Front-end, Back-end e Banco de Dados persistente.

O sistema permite o gerenciamento de **pacientes, médicos, consultas e prontuários**, com funcionalidades completas de **criação, consulta, atualização e exclusão (CRUD)**.

---

## 🎯 Objetivo do Projeto

Aplicar na prática os conceitos estudados em sala de aula, incluindo:

- Arquitetura em camadas
- Desenvolvimento Full Stack
- Integração entre Front-end e Back-end
- Persistência de dados
- Versionamento de código
- Gerenciamento de projeto com entregas incrementais

---

## 🛠️ Tecnologias Utilizadas

### Front-end
- React
- Tailwind CSS
- Axios

### Back-end
- Node.js
- Express
- Mongoose

### Banco de Dados
- MongoDB Atlas (Banco de dados persistente)

### Ferramentas
- Git e GitHub
- Trello (gerenciamento do projeto)
- Draw.io (diagramas)

---

## 🧱 Arquitetura do Sistema

O projeto segue o padrão de **arquitetura em três camadas**:

1. **Front-end**  
   Responsável pela interface do usuário e consumo da API.

2. **Back-end**  
   API REST responsável pela lógica de negócio e comunicação com o banco de dados.

3. **Banco de Dados**  
   MongoDB Atlas para armazenamento persistente das informações.

---

## 📂 Estrutura do Projeto

```bash
medflow-hospital-management/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   └── app.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.jsx
│
└── README.md
