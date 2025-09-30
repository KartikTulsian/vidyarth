/*
  Warnings:

  - You are about to drop the column `safe_detail_id` on the `Trade` table. All the data in the column will be lost.
  - You are about to drop the `SafeDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SafeDetails" DROP CONSTRAINT "SafeDetails_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Trade" DROP CONSTRAINT "Trade_safe_detail_id_fkey";

-- AlterTable
ALTER TABLE "public"."Trade" DROP COLUMN "safe_detail_id";

-- DropTable
DROP TABLE "public"."SafeDetails";
