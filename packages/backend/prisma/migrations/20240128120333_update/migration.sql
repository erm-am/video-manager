/*
  Warnings:

  - Added the required column `bitRate` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `displayAspectRatio` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `duration` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `files` ADD COLUMN `bitRate` INTEGER NOT NULL,
    ADD COLUMN `displayAspectRatio` CHAR(255) NOT NULL,
    ADD COLUMN `duration` INTEGER NOT NULL,
    ADD COLUMN `height` INTEGER NOT NULL,
    ADD COLUMN `width` INTEGER NOT NULL;
