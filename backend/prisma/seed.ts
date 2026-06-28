import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const LAWYER_NAMES = [
  {
    name: "Jose Mourinho",
    oab: "123.456",
    specialties: ["Civil", "Trabalhista"],
  },
  {
    name: "Fernanda Lima",
    oab: "234.567",
    specialties: ["Trabalhista", "Civil"],
  },
  {
    name: "Carlos Eduardo",
    oab: "345.678",
    specialties: ["Civil", "Empresarial"],
  },
  {
    name: "Mariana Souza Silva",
    oab: "456.789",
    specialties: ["Família", "Sucessões"],
  },
  {
    name: "João Pedro Santos",
    oab: "567.890",
    specialties: ["Penal", "Civil"],
  },
];

const CLIENT_NAMES = [
  "Carlos Roberto Alves",
  "Filial Porto Alegre",
  "Mariana Souza Silva",
  "Empresa XYZ LTDA",
  "João Pedro Santos",
  "Construtora ABC",
  "Supermercado Central",
  "Lucas Ferreira Lima",
  "Indústria Delta S.A.",
  "Ana Clara Oliveira",
];

const INSTANCES = [
  "PRIMEIRA_INSTANCIA",
  "SEGUNDA_INSTANCIA",
  "TRABALHISTA",
  "OUTROS",
] as const;
const STATUSES = [
  "EM_ANDAMENTO",
  "CONCLUIDO",
  "VENCIDO",
  "AGUARDANDO",
  "PENDENTE",
] as const;
const PHASES = [
  "Citação",
  "Instrução",
  "Execução",
  "Recursos",
  "Despacho",
  "Julgamento",
];

function randomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateInLastMonths(months: number) {
  const now = new Date();
  const past = new Date(now.getFullYear(), now.getMonth() - months, 1);
  const diff = now.getTime() - past.getTime();
  return new Date(past.getTime() + Math.random() * diff);
}

async function main() {
  console.log("🌱 Iniciando seed...");

  const hashedPassword = await bcrypt.hash("senha123", 10);

  // Cria advogados extras
  const lawyers = [];
  for (const data of LAWYER_NAMES) {
    const email = `${data.name.toLowerCase().split(" ")[0]}@asimov.com.br`;
    const lawyer = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name: data.name,
        email,
        password: hashedPassword,
        role: "ADVOGADO",
        oab: data.oab,
        oabState: "RS",
        specialties: data.specialties,
        experienceYears: Math.floor(Math.random() * 15) + 2,
      },
    });
    lawyers.push(lawyer);
  }

  // Cria categorias
  const categoryNames = [
    { name: "Civil", type: "AREA_DO_DIREITO" as const },
    { name: "Trabalhista", type: "AREA_DO_DIREITO" as const },
    { name: "Empresarial", type: "AREA_DO_DIREITO" as const },
    { name: "Tributário", type: "AREA_DO_DIREITO" as const },
  ];
  const categories = [];
  for (const cat of categoryNames) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name },
    });
    const category = existing ?? (await prisma.category.create({ data: cat }));
    categories.push(category);
  }

  // Cria clientes extras
  const clients = [];
  for (const name of CLIENT_NAMES) {
    const existing = await prisma.client.findFirst({ where: { name } });
    const client =
      existing ??
      (await prisma.client.create({
        data: {
          name,
          type:
            name.includes("LTDA") ||
            name.includes("S.A.") ||
            name.includes("Construtora")
              ? "PESSOA_JURIDICA"
              : "PESSOA_FISICA",
          email: `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
          phone: `(51) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
        },
      }));
    clients.push(client);
  }

  // Cria 40 processos distribuídos
  for (let i = 0; i < 40; i++) {
    const number = `${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(10 + Math.random() * 90)}.2026`;
    const exists = await prisma.process.findUnique({ where: { number } });
    if (exists) continue;

    await prisma.process.create({
      data: {
        number,
        description: "Processo gerado para teste de relatórios",
        status: randomItem(STATUSES),
        instance: randomItem(INSTANCES),
        phase: randomItem(PHASES),
        startDate: randomDateInLastMonths(6),
        clientId: randomItem(clients).id,
        lawyerId: randomItem(lawyers).id,
        categoryId: randomItem(categories).id,
      },
    });
  }

  console.log("✅ Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
