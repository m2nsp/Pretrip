/*
  Warnings:

  - You are about to drop the column `logitude` on the `location` table. All the data in the column will be lost.
  - Added the required column `longitude` to the `Location` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `location` DROP COLUMN `logitude`,
    ADD COLUMN `longitude` DOUBLE NOT NULL;
