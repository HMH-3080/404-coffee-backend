-- DropTable (Attendance no longer required)
DROP TABLE IF EXISTS "attendance";

-- DropEnum
DROP TYPE IF EXISTS "AttendanceStatus";

-- DropEnum
DROP TYPE IF EXISTS "AttendanceMethod";

-- AlterTable (Product barcode not required)
ALTER TABLE "products" DROP COLUMN IF EXISTS "barcode";

-- AlterTable (User fingerprintId not required)
ALTER TABLE "users" DROP COLUMN IF EXISTS "fingerprintId";