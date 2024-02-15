/*
  Warnings:

  - You are about to drop the column `file_counts` on the `uploads` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[upload_hash]` on the table `uploads` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `amount` to the `uploads` table without a default value. This is not possible if the table is not empty.
  - Added the required column `upload_hash` to the `uploads` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `uploads` DROP COLUMN `file_counts`,
    ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `upload_hash` CHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `uploads_upload_hash_key` ON `uploads`(`upload_hash`);
