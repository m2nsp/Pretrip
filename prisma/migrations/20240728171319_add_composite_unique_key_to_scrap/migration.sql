/*
  Warnings:

  - A unique constraint covering the columns `[scrapperId,scrapPlaceId]` on the table `Scrap` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Scrap_scrapperId_scrapPlaceId_key` ON `Scrap`(`scrapperId`, `scrapPlaceId`);
