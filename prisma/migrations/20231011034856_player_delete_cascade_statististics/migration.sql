-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_stats_id_fkey";

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_stats_id_fkey" FOREIGN KEY ("stats_id") REFERENCES "Statistics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
