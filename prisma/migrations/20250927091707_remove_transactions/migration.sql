/*
  Warnings:

  - You are about to drop the `Transaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_trade_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Transaction" DROP CONSTRAINT "Transaction_user_id_fkey";

-- DropTable
DROP TABLE "public"."Transaction";
