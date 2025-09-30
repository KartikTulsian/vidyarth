/*
  Warnings:

  - You are about to alter the column `price` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `rental_price_per_day` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `security_deposit` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `exchange_item_value` on the `Offer` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `max_price` on the `Request` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `max_rental_per_day` on the `Request` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `original_price` on the `Stuff` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `agreed_price` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `security_deposit` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `late_fee` on the `Trade` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `DoublePrecision`.
  - Made the column `original_price` on table `Stuff` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Offer" ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "rental_price_per_day" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "security_deposit" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "exchange_item_value" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Request" ALTER COLUMN "max_price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "max_rental_per_day" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Stuff" ALTER COLUMN "original_price" SET NOT NULL,
ALTER COLUMN "original_price" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Trade" ALTER COLUMN "agreed_price" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "security_deposit" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "late_fee" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Transaction" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;
