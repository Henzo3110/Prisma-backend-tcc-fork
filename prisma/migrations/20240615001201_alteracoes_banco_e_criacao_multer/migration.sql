/*
  Warnings:

  - Added the required column `sobreMim` to the `UserEmpresa` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `userempresa` ADD COLUMN `sobreMim` LONGTEXT NOT NULL;
