/*
  Warnings:

  - Added the required column `status` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `files` ADD COLUMN `status` CHAR(255) NOT NULL;
