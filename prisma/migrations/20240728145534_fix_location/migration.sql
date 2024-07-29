/*
  Warnings:

  - You are about to alter the column `logitude` on the `location` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `latitude` on the `location` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `location` MODIFY `logitude` DOUBLE NOT NULL,
    MODIFY `latitude` DOUBLE NOT NULL;
