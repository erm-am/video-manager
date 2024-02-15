/*
  Warnings:

  - You are about to alter the column `upload_hash` on the `uploads` table. The data in that column could be lost. The data in that column will be cast from `Char(36)` to `Char(32)`.
  - Added the required column `status` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `uploads` ADD COLUMN `status` CHAR(255) NOT NULL,
    MODIFY `upload_hash` CHAR(32) NOT NULL;
