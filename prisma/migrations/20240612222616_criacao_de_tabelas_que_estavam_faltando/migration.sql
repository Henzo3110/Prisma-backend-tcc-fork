/*
  Warnings:

  - Added the required column `quantidade` to the `Vaga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `salario` to the `Vaga` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vaga` ADD COLUMN `quantidade` CHAR(4) NOT NULL,
    ADD COLUMN `salario` CHAR(10) NOT NULL;
