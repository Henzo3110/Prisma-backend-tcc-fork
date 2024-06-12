/*
  Warnings:

  - Added the required column `sobreMim` to the `UserCandidato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `curriculo_form` ADD COLUMN `empresasAntecedentes` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `usercandidato` ADD COLUMN `sobreMim` LONGTEXT NOT NULL;
