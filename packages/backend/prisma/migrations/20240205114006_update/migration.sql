/*
  Warnings:

  - You are about to drop the column `user_id` on the `files` table. All the data in the column will be lost.
  - You are about to alter the column `upload_id` on the `files` table. The data in that column could be lost. The data in that column will be cast from `Char(36)` to `Int`.
  - You are about to drop the `upload_tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_upload_id_fkey`;

-- DropForeignKey
ALTER TABLE `files` DROP FOREIGN KEY `files_user_id_fkey`;

-- AlterTable
ALTER TABLE `files` DROP COLUMN `user_id`,
    MODIFY `upload_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `upload_tasks`;

-- CreateTable
CREATE TABLE `uploads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_counts` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `uploads` ADD CONSTRAINT `uploads_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_upload_id_fkey` FOREIGN KEY (`upload_id`) REFERENCES `uploads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
