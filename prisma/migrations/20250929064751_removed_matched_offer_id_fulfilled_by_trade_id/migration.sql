/*
  Warnings:

  - You are about to drop the column `fulfilled_by_trade_id` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `matched_offer_id` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Request" DROP COLUMN "fulfilled_by_trade_id",
DROP COLUMN "matched_offer_id";
