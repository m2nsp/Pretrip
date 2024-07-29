-- DropForeignKey
ALTER TABLE `event` DROP FOREIGN KEY `Event_eventCreatorId_fkey`;

-- DropForeignKey
ALTER TABLE `eventlocation` DROP FOREIGN KEY `EventLocation_eventId_fkey`;

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_eventCreatorId_fkey` FOREIGN KEY (`eventCreatorId`) REFERENCES `User`(`email`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventLocation` ADD CONSTRAINT `EventLocation_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
