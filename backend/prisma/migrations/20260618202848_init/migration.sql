-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMINISTRADOR', 'ADVOGADO', 'ASSISTENTE', 'ESTAGIARIO', 'FINANCEIRO', 'VISUALIZADOR');

-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('PESSOA_FISICA', 'PESSOA_JURIDICA');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('AREA_DO_DIREITO', 'TIPO_DE_PROCESSO', 'FASE', 'VARA');

-- CreateEnum
CREATE TYPE "ProcessStatus" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO', 'VENCIDO', 'AGUARDANDO', 'PENDENTE', 'ARQUIVADO');

-- CreateEnum
CREATE TYPE "Instance" AS ENUM ('PRIMEIRA_INSTANCIA', 'SEGUNDA_INSTANCIA', 'TRABALHISTA', 'SUPERIOR_TRIBUNAL', 'OUTROS');

-- CreateEnum
CREATE TYPE "DeadlineType" AS ENUM ('PROCESSUAL', 'AUDIENCIA', 'OUTROS');

-- CreateEnum
CREATE TYPE "DeadlineStatus" AS ENUM ('PENDENTE', 'VENCE_HOJE', 'VENCIDO', 'CONCLUIDO');

-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('AUDIENCIA', 'REUNIAO', 'PRAZO', 'OUTROS');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADVOGADO',
    "avatar" TEXT,
    "phone" TEXT,
    "position" TEXT,
    "team" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "oab" TEXT,
    "oabState" TEXT,
    "specialties" TEXT[],
    "experienceYears" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ClientType" NOT NULL DEFAULT 'PESSOA_FISICA',
    "company" TEXT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "rg" TEXT,
    "birthDate" TIMESTAMP(3),
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CategoryType" NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "processes" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "description" TEXT,
    "status" "ProcessStatus" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "instance" "Instance" NOT NULL,
    "phase" TEXT NOT NULL,
    "vara" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isFinished" BOOLEAN NOT NULL DEFAULT false,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clientId" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,
    "categoryId" TEXT,

    CONSTRAINT "processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deadlines" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "DeadlineType" NOT NULL DEFAULT 'PROCESSUAL',
    "status" "DeadlineStatus" NOT NULL DEFAULT 'PENDENTE',
    "date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processId" TEXT NOT NULL,
    "lawyerId" TEXT NOT NULL,

    CONSTRAINT "deadlines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "AppointmentType" NOT NULL DEFAULT 'REUNIAO',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processId" TEXT,
    "lawyerId" TEXT NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clients_cpf_key" ON "clients"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "clients_cnpj_key" ON "clients"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "processes_number_key" ON "processes"("number");

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "processes" ADD CONSTRAINT "processes_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deadlines" ADD CONSTRAINT "deadlines_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_lawyerId_fkey" FOREIGN KEY ("lawyerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
