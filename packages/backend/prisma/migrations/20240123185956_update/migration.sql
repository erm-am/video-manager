/*
  Warnings:

  - You are about to alter the column `user_id` on the `files` table. The data in that column could be lost. The data in that column will be cast from `Char(255)` to `Int`.

*/
-- AlterTable
ALTER TABLE `files` MODIFY `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
