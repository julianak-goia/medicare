This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# medicare

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
```
