/*
  Warnings:

  - You are about to drop the column `expiryDate` on the `raw_materials` table. All the data in the column will be lost.
  - You are about to drop the column `pricePerUnit` on the `raw_materials` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `raw_materials` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "raw_materials" DROP COLUMN "expiryDate",
DROP COLUMN "pricePerUnit",
DROP COLUMN "quantity";

-- CreateTable
CREATE TABLE "raw_material_batches" (
    "id" SERIAL NOT NULL,
    "rawMaterialId" INTEGER NOT NULL,
    "quantity" DECIMAL(12,2) NOT NULL,
    "pricePerUnit" DECIMAL(12,2) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "raw_material_batches_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "raw_material_batches_rawMaterialId_idx" ON "raw_material_batches"("rawMaterialId");

-- CreateIndex
CREATE INDEX "raw_material_batches_expiryDate_idx" ON "raw_material_batches"("expiryDate");

-- AddForeignKey
ALTER TABLE "raw_material_batches" ADD CONSTRAINT "raw_material_batches_rawMaterialId_fkey" FOREIGN KEY ("rawMaterialId") REFERENCES "raw_materials"("id") ON DELETE CASCADE ON UPDATE CASCADE;
