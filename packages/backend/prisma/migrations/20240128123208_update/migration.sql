-- AlterTable
ALTER TABLE `files` MODIFY `duration` INTEGER NULL,
    MODIFY `height` INTEGER NULL,
    MODIFY `width` INTEGER NULL,
    MODIFY `bit_rate` INTEGER NULL,
    MODIFY `display_aspect_ratio` CHAR(255) NULL;
