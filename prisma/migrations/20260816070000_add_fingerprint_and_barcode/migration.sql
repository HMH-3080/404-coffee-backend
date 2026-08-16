-- CreateEnum
CREATE TYPE "AttendanceMethod" AS ENUM ('MANUAL', 'FINGERPRINT');

-- AlterTable
ALTER TABLE "attendance" ADD COLUMN "method" "AttendanceMethod" NOT NULL DEFAULT 'MANUAL';

-- AlterTable
ALTER TABLE "products" ADD COLUMN "barcode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "products"("barcode");

-- AlterTable
ALTER TABLE "users" ADD COLUMN "fingerprintId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_fingerprintId_key" ON "users"("fingerprintId");