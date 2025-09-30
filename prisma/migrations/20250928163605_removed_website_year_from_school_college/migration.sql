/*
  Warnings:

  - You are about to drop the column `established_year` on the `SchoolCollege` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `SchoolCollege` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."SchoolCollege" DROP COLUMN "established_year",
DROP COLUMN "website";
