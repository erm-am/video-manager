/*
  Warnings:

  - Added the required column `name` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `files` ADD COLUMN `name` CHAR(255) NOT NULL;
