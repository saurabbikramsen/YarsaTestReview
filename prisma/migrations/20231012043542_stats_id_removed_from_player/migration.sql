/*
  Warnings:

  - You are about to drop the column `stats_id` on the `Player` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Player_stats_id_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "stats_id";
