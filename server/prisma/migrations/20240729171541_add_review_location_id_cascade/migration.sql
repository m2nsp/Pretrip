-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_locationId_fkey`;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
