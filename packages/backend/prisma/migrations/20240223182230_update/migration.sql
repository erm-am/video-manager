/*
  Warnings:

  - You are about to drop the `uploads` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `path` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stage` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_uploadId_fkey`;

-- DropForeignKey
ALTER TABLE `uploads` DROP FOREIGN KEY `uploads_userId_fkey`;

-- AlterTable
ALTER TABLE `files` ADD COLUMN `path` VARCHAR(1024) NOT NULL,
    ADD COLUMN `stage` CHAR(255) NOT NULL;

-- DropTable
DROP TABLE `uploads`;

-- CreateTable
CREATE TABLE `upload_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `groupName` CHAR(32) NOT NULL,
    `amount` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `status` CHAR(255) NOT NULL,
    `stage` CHAR(255) NOT NULL,

    UNIQUE INDEX `upload_groups_groupName_key`(`groupName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `upload_groups` ADD CONSTRAINT `upload_groups_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_uploadId_fkey` FOREIGN KEY (`uploadId`) REFERENCES `upload_groups`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
