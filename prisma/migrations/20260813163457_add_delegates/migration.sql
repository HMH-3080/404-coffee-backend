-- CreateEnum
CREATE TYPE "DelegateStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "delegateId" INTEGER;

-- CreateTable
CREATE TABLE "delegates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "image" TEXT,
    "status" "DelegateStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "delegates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "delegates_name_idx" ON "delegates"("name");

-- CreateIndex
CREATE INDEX "delegates_status_idx" ON "delegates"("status");

-- CreateIndex
CREATE INDEX "orders_delegateId_idx" ON "orders"("delegateId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delegateId_fkey" FOREIGN KEY ("delegateId") REFERENCES "delegates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
