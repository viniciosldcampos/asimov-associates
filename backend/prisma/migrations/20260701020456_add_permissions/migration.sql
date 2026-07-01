-- CreateEnum
CREATE TYPE "PermissionLevel" AS ENUM ('FULL', 'EDIT', 'READ', 'NONE');

-- CreateEnum
CREATE TYPE "AppModule" AS ENUM ('DASHBOARD', 'PROCESSOS', 'ADVOGADOS', 'CLIENTES', 'AGENDA', 'PRAZOS', 'RELATORIOS', 'CONFIGURACOES', 'USUARIOS', 'PERMISSOES', 'CATEGORIAS', 'FINANCEIRO');

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "level" "PermissionLevel" NOT NULL DEFAULT 'READ',
    "module" "AppModule" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_userId_module_key" ON "permissions"("userId", "module");

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
