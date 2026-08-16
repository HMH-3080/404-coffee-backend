-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "DrawerTransactionType" AS ENUM ('SALES', 'COLLECTION', 'EXPENSE', 'SALARY', 'MAINTENANCE', 'PURCHASE', 'INCENTIVE');

-- CreateTable
CREATE TABLE "cash_drawer_shifts" (
    "id" SERIAL NOT NULL,
    "openedByUserId" INTEGER NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "openingBalance" DECIMAL(12,2) NOT NULL,
    "closedByUserId" INTEGER,
    "closedAt" TIMESTAMP(3),
    "closingBalance" DECIMAL(12,2),
    "actualBalance" DECIMAL(12,2),
    "difference" DECIMAL(12,2),
    "notes" TEXT,
    "status" "ShiftStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cash_drawer_shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cash_drawer_transactions" (
    "id" SERIAL NOT NULL,
    "shiftId" INTEGER NOT NULL,
    "type" "DrawerTransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "description" TEXT,
    "recordedByUserId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cash_drawer_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cash_drawer_shifts_openedByUserId_idx" ON "cash_drawer_shifts"("openedByUserId");

-- CreateIndex
CREATE INDEX "cash_drawer_shifts_status_idx" ON "cash_drawer_shifts"("status");

-- CreateIndex
CREATE INDEX "cash_drawer_shifts_openedAt_idx" ON "cash_drawer_shifts"("openedAt");

-- CreateIndex
CREATE INDEX "cash_drawer_transactions_shiftId_idx" ON "cash_drawer_transactions"("shiftId");

-- CreateIndex
CREATE INDEX "cash_drawer_transactions_type_idx" ON "cash_drawer_transactions"("type");

-- AddForeignKey
ALTER TABLE "cash_drawer_shifts" ADD CONSTRAINT "cash_drawer_shifts_openedByUserId_fkey" FOREIGN KEY ("openedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_drawer_shifts" ADD CONSTRAINT "cash_drawer_shifts_closedByUserId_fkey" FOREIGN KEY ("closedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_drawer_transactions" ADD CONSTRAINT "cash_drawer_transactions_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "cash_drawer_shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cash_drawer_transactions" ADD CONSTRAINT "cash_drawer_transactions_recordedByUserId_fkey" FOREIGN KEY ("recordedByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
