/*
  Warnings:

  - You are about to drop the column `bitRate` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `displayAspectRatio` on the `files` table. All the data in the column will be lost.
  - Added the required column `bit_rate` to the `files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `display_aspect_ratio` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `files` DROP COLUMN `bitRate`,
    DROP COLUMN `displayAspectRatio`,
    ADD COLUMN `bit_rate` INTEGER NOT NULL,
    ADD COLUMN `display_aspect_ratio` CHAR(255) NOT NULL;
