/*
  Warnings:

  - A unique constraint covering the columns `[player_id]` on the table `Statistics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `player_id` to the `Statistics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_stats_id_fkey";

-- AlterTable
ALTER TABLE "Statistics" ADD COLUMN     "player_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Statistics_player_id_key" ON "Statistics"("player_id");

-- AddForeignKey
ALTER TABLE "Statistics" ADD CONSTRAINT "Statistics_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
