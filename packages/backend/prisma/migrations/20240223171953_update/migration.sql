/*
  Warnings:

  - You are about to drop the column `bit_rate` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `display_aspect_ratio` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `upload_id` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `upload_hash` on the `uploads` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `uploads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uploadHash]` on the table `uploads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uploadId` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uploadHash` to the `uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_upload_id_fkey`;

-- DropForeignKey
ALTER TABLE `uploads` DROP FOREIGN KEY `uploads_user_id_fkey`;

-- DropIndex
DROP INDEX `uploads_upload_hash_key` ON `uploads`;

-- AlterTable
ALTER TABLE `files` DROP COLUMN `bit_rate`,
    DROP COLUMN `display_aspect_ratio`,
    DROP COLUMN `upload_id`,
    ADD COLUMN `bitRate` INTEGER NULL,
    ADD COLUMN `displayAspectRatio` CHAR(255) NULL,
    ADD COLUMN `uploadId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `uploads` DROP COLUMN `upload_hash`,
    DROP COLUMN `user_id`,
    ADD COLUMN `uploadHash` CHAR(32) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `uploads_uploadHash_key` ON `uploads`(`uploadHash`);

-- AddForeignKey
ALTER TABLE `uploads` ADD CONSTRAINT `uploads_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_uploadId_fkey` FOREIGN KEY (`uploadId`) REFERENCES `uploads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
