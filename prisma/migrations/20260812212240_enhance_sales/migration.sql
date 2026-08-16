/*
  Warnings:

  - Added the required column `subtotal` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'WALLET');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "sales"
ADD COLUMN "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
ADD COLUMN "status" "SaleStatus" NOT NULL DEFAULT 'COMPLETED',
ADD COLUMN "subtotal" DECIMAL(12,2) NOT NULL DEFAULT 0;

-- Set subtotal for existing sales
UPDATE "sales"
SET "subtotal" = "total"
WHERE "subtotal" = 0;

-- CreateIndex
CREATE INDEX "sales_createdAt_idx" ON "sales"("createdAt");

-- CreateIndex
CREATE INDEX "sales_status_idx" ON "sales"("status");
