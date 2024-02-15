/*
  Warnings:

  - You are about to alter the column `upload_id` on the `files` table. The data in that column could be lost. The data in that column will be cast from `Char(255)` to `Char(36)`.
  - You are about to drop the `tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `files` MODIFY `upload_id` CHAR(36) NOT NULL;

-- DropTable
DROP TABLE `tasks`;

-- CreateTable
CREATE TABLE `upload_tasks` (
    `id` VARCHAR(191) NOT NULL,
    `name` CHAR(255) NULL,
    `type` CHAR(255) NULL,
    `status` CHAR(255) NULL,

    UNIQUE INDEX `upload_tasks_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_upload_id_fkey` FOREIGN KEY (`upload_id`) REFERENCES `upload_tasks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
